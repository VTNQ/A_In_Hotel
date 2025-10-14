package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomResponse {
    private String id;
    private String roomNumber;
    private String roomName;
    private String roomCode;
    private String roomTypeName;
    private String status;
    private BigDecimal defaultRate;
    private Integer floor;
    private Double area;
    private String note;
    private List<ImageRoomResponse> images;

}

