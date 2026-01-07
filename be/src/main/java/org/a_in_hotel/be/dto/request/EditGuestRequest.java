package org.a_in_hotel.be.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EditGuestRequest {

    private String guestName;

    private String surname;

    private String email;

    private String phoneNumber;

    private Integer guestType;
}
