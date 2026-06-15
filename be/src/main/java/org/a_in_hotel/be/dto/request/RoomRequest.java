package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.a_in_hotel.be.Enum.RoomStatus;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Data
public class RoomRequest {

    @NotBlank(message = "Room name is required / Tên phòng không được để trống")
    @Size(max = 255, message = "Room name must not exceed 255 characters / Tên phòng không được vượt quá 255 ký tự")
    private String roomName;
    @NotNull(message = "Room type is required / Loại phòng không được để trống")
    @Min(value = 1, message = "Room type is invalid / Loại phòng không hợp lệ")
    private Integer idRoomType;
    private Integer status=3;
    @NotNull(message = "Capacity is required / Sức chứa không được để trống")
    @Min(value = 1, message = "Capacity must be at least 1 / Sức chứa phải lớn hơn hoặc bằng 1")
    private Integer capacity;
    @NotNull(message = "Price per full day is required / Giá theo ngày không được để trống")
    @DecimalMin(value = "0.0", inclusive = true,
            message = "Price per full day must be greater than or equal to 0 / Giá theo ngày phải lớn hơn hoặc bằng 0")
    private BigDecimal defaultRate;
    @NotNull(message = "Area is required / Diện tích không được để trống")
    @Min(value = 1, message = "Area must be greater than 1 / Diện tích phải lớn hơn 1")
    private Double area;
    @Size(max = 2000, message = "Note must not exceed 2000 characters / Ghi chú không được vượt quá 2000 ký tự")
    private String note;
    private BigDecimal hourlyBasePrice; //ví dụ (2 giờ đầu)
//    private Integer hourlyBaseDuration; // ví dụ: 2(số giờ)
    private BigDecimal hourlyAdditionalPrice;//ví dụ: 120000 (mỗi giờ sau)
    // giá ban đêm
    private BigDecimal overnightPrice;

    List<String> oldImages;

    private Long hotelId;
    @Size(max = 5,message = "Maximum 5 images are allowed / Tối đa 5 hình ảnh")
    private List<MultipartFile>images;

}
