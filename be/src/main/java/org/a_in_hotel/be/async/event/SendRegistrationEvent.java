package org.a_in_hotel.be.async.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SendRegistrationEvent {
    private  String email;
    private String fullName;
    private String password;
}
