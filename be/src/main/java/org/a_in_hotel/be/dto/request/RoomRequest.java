package org.a_in_hotel.be.dto.request;

import lombok.Data;
import org.a_in_hotel.be.Enum.RoomStatus;

import java.math.BigDecimal;

@Data
public class RoomRequest {
    private String roomNumber;
    private String roomName;
    private Integer idRoomType;
    private RoomStatus status;
    private BigDecimal defaultRate;
    private Integer floor;
    private Double area;
    private String note;
}
