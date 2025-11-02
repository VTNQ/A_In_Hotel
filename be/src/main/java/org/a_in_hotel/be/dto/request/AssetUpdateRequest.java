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
    @NotBlank @Size(max = 255)
    private String assetName;

    @NotNull
    private Long categoryId;

    private Long roomId;

    @NotNull @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal price;

    @NotNull @Min(0)
    private Integer quantity;

    @NotNull
    private AssetStatus status;

    @Size(max = 2000)
    private String notes;
}
