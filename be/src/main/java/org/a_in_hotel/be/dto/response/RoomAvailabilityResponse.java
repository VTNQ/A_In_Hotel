package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomAvailabilityResponse {

    private Long totalRooms;
    private Long available;
    private Long reserved;
    private Long occupied;
    private Long notReady;
}
