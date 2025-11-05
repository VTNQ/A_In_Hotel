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
public class AssetUpdateRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 255)
    private String assetName;

    @NotNull(message = "Category is required")
    @Min(value = 1,message = "Category is required")
    private Long categoryId;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true,message = "Price must be greater than or equal to 0")
    private BigDecimal price;

    @NotNull(message = "Quantity is required")
    @Min(value = 0,message = "Quantity must be greater than or equal to 0")
    private Integer quantity;

    @NotNull
    private Integer status=1;

    @Size(max = 2000,message = "Notes must not exceed 2000 characters")
    private String notes;
}
