package org.a_in_hotel.be.dto.request;

import lombok.*;
import org.a_in_hotel.be.Enum.AssetStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetFilterRequest {
    private String keyword;     // search AssetCode/AssetName
    private AssetStatus status; // nếu null => All
    private Long categoryId;
    private Long roomId;

    private Integer page = 1;   // 1-based
    private Integer size = 20;  // default 20
    private String sort = "id,desc";
}
