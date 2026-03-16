package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import org.a_in_hotel.be.Enum.AssetStatus;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetCreateRequest {
    @NotBlank(message = "Asset Name is required / Tên tài sản không được để trống")
    @NotNull(message = "Asset Name is required / Tên tài sản không được để trống")
    @Size(max = 255,message = "Asset name must not exceed 255 characters / Tên tài sản tối đa 255 ký tự")
    private String assetName;

    @NotNull(message = "Category is required / Danh mục không được để trống")
    private Long categoryId;
    @NotNull(message = "Room Number is required / Phòng không được để trống")
    private Long roomId;

    @NotNull(message = "Price is required / Giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = true,message = "Invalid price format / Giá phải lớn hơn hoặc bằng 0")
    private BigDecimal price;

    @NotNull(message = "Quantity is required / Số lượng không được để trống")
    @Min(value = 0,message = "Quantity must be greater than or equal to 0 / Số lượng phải lớn hơn hoặc bằng 0")
    private Integer quantity;
    private Integer status=1;

    @Size(max = 2000,message = "Note must not exceed 2000 characters / Ghi chú tối đa 2000 ký tự")
    private String note;

    private Long hotelId;
}
