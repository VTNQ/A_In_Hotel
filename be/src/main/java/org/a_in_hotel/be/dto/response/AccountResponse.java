package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.a_in_hotel.be.Enum.Gender;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {
    private String email;
    private Long id;
    private Gender gender;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private LocalDate birthday;
}
