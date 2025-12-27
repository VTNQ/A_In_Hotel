package org.a_in_hotel.be.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomSwitchItem {

    private Long bookingDetailId;

    private Long newRoomId;

    private String reason;
}
