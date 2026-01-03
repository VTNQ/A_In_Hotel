package org.a_in_hotel.be.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomResponse {
    private Long id;
    private String roomNumber;
    private String roomName;
    private String roomCode;
    private Integer capacity;
    private Long idRoomType;
    private String hotelName;
    private String hotelAddress;
    private String roomTypeName;
    private Integer status;
    private Long hotelId;
    private BigDecimal defaultRate;
    private Integer floor;
    private Double area;
    private List<AssetResponse> assets;
    private String note;
    private List<ImageResponse> images;
    private BigDecimal hourlyBasePrice;
    private BigDecimal hourlyAdditionalPrice;
    private BigDecimal overnightPrice;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private OffsetDateTime createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private OffsetDateTime updatedAt;
}

