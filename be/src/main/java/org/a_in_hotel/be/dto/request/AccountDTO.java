package org.a_in_hotel.be.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.a_in_hotel.be.Enum.Gender;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {
    private String email;
    private Long idRole;
    private Integer gender;
    private String fullName;
    private String phone;
    private LocalDate birthday;
}
