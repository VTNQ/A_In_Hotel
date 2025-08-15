package com.example.userservice.kafka;

import com.example.userservice.dto.request.UserRequest;
import com.example.userservice.kafka.event.UserRegisteredEvent;
import com.example.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserEventListener {
    private final UserService userService;
    @KafkaListener(
            topics = "${app.kafka.topic.user-registered}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "userRegisteredKafkaListenerContainerFactory"
    )
    public void handle(UserRegisteredEvent event, Acknowledgment ack) {
        try {
            log.info("Received UserRegistered event {}", event);
            UserRequest request=UserRequest.builder()
                    .fullName(event.getFullName())
                    .avatarUrl(event.getAvatarUrl())
                    .phone(event.getPhone())
                    .build();
            request.setAccountId(event.getAccountId());
            userService.save(request);
            ack.acknowledge();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
