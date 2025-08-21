package com.example.userservice.dto.request;

import com.example.commonutils.Enum.Gender;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRequest {
    private Long accountId;
    private String fullName;
    private String avatarUrl;
    private String phone;
    private Gender gender;
    private LocalDate birthday;
}
