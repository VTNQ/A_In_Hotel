package com.example.userservice.kafka.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRegisteredEvent {
    private Long accountId;
    private String email;
    private String fullName;
    private String phone;
    private String avatarUrl;
}
