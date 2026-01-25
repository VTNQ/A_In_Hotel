package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionRoomTypeResponse {
    private Long roomTypeId;
    private String roomTypeName;
    private boolean excluded;
}
