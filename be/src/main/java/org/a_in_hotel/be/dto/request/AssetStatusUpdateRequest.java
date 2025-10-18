package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.a_in_hotel.be.Enum.AssetStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetStatusUpdateRequest {
    @NotNull
    private AssetStatus status;

    private String note; // optional để ghi log
}
