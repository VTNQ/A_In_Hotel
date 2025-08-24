package com.example.authservice.dto.request;


import com.example.authservice.Enum.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountDTO {
    private Long id;
    private String email;
    private String password;
    private Long idRole;
    private Gender gender;
    private String fullName;
    private String phone;
    private String avatarUrl;

    private LocalDate birthday;
}
