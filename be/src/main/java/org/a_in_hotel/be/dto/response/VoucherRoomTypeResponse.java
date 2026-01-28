package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class VoucherRoomTypeResponse {
    private Long roomTypeId;
    private String roomTypeName;
    private boolean excluded;
}
