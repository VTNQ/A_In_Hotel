package com.example.authservice.kafka.producer;

import com.example.authservice.kafka.event.UserRegisteredEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserEventProducer {
    private final KafkaTemplate<String, UserRegisteredEvent>kafkaTemplate;
    public void publishUserRegistered(String topic, UserRegisteredEvent userRegisteredEvent) {
        kafkaTemplate.send(topic,String.valueOf(userRegisteredEvent.getAccountId()), userRegisteredEvent);
    }
}
