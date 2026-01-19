package org.a_in_hotel.be.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionBookingConditionRequest {

    private Integer bookingType;

    private Integer minNights;

    private Integer maxNights;


    private Integer minRooms;
}
