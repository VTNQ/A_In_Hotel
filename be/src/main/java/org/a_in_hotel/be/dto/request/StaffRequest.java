package org.a_in_hotel.be.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffRequest {
    private String email;
    private String fullName;
    private Integer gender;
    private String phone;
    private LocalDate birthday;
    private Long idRole;
    private Boolean isActive;
}
