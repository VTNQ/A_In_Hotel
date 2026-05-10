package org.a_in_hotel.be.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerUpdateProfileDTO {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
}
