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
    @NotBlank(message = "Asset Name is required")
    @Size(max = 255)
    private String assetName;

    @NotNull(message = "Category is required")
    private Long categoryId;
    private Long roomId;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal price;

    @NotNull @Min(value = 0,message = "Quantity must be greater than or equal to 0")
    private Integer quantity;
    private Integer status=1;

    @Size(max = 2000)
    private String note;
}
