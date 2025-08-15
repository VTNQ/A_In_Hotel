package com.example.authservice.kafka.event;

import com.example.authservice.Enum.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegisteredEvent {
    private Long accountId;
    private String fullName;
    private String avatarUrl;
    private String phone;
    private Gender gender;
    private LocalDate birthday;
}
