package org.a_in_hotel.be.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileSystemRequest {
    private String fullName;
    private String phone;
    private LocalDate birthday;
    private Integer gender;
}
