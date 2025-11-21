package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.a_in_hotel.be.Enum.RoomStatus;

import java.math.BigDecimal;
import java.util.List;

@Data
public class RoomRequest {
    @NotBlank(message = "Room number is required")
    @Size(max = 50,message = "Room number must not exceed 50 characters")
    private String roomNumber;
    @NotBlank(message = "Room name is required")
    @Size(max = 255, message = "Room name must not exceed 255 characters")
    private String roomName;
    @NotNull(message = "Room type is required")
    @Min(value = 1,message = "Room Type is required")
    private Integer idRoomType;
    private Integer status=3;
    @NotNull(message = "Capacity is required")
    @Min(value = 1,message = "Capacity must be least 1")
    private Integer capacity;
    @NotNull(message = "Price/Full Day is required")
    @DecimalMin(value = "0.0",inclusive = true,message = "Price/Full Day must be greater than or equal to 0")
    private BigDecimal defaultRate;
    @Min(value = 0, message = "Floor must be greater than or equal to 0")
    private Integer floor;
    @NotNull(message = "Area is required")
    @Min(value = 1, message = "Area must be greater than 1")
    private Double area;
    @Size(max = 2000, message = "Note must not exceed 2000 characters")
    private String note;
    private BigDecimal hourlyBasePrice; //ví dụ (2 giờ đầu)
//    private Integer hourlyBaseDuration; // ví dụ: 2(số giờ)
    private BigDecimal hourlyAdditionalPrice;//ví dụ: 120000 (mỗi giờ sau)
    // giá ban đêm
    private BigDecimal overnightPrice;

    List<String> oldImages;

}
