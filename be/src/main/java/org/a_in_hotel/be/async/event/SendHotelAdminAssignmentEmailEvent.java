package org.a_in_hotel.be.async.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SendHotelAdminAssignmentEmailEvent {
    private String email;
    private String fullName;
    private String hotelName;
}
