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
    private Long idAsset;
    private BigDecimal defaultRate;
    private Integer floor;
    private Double area;
    private String note;
    private BigDecimal hourlyBasePrice; //ví dụ (2 giờ đầu)
    private Integer hourlyBaseDuration; // ví dụ: 2(số giờ)
    private BigDecimal hourlyAdditionalPrice;//ví dụ: 120000 (mỗi giờ sau)
    // giá ban đêm
    private BigDecimal overnightPrice;

}
