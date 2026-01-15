package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerProfileResponse {
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
}
