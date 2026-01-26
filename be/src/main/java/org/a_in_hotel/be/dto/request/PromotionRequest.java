package org.a_in_hotel.be.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionRequest {

    private String name;

    private String description;

    private Integer type;

    private BigDecimal value;

    private Integer priority;

    private LocalDate startDate;

    private LocalDate endDate;
    private Integer bookingType;

    private Integer minNights;

    private Integer customerType;



    private List<PromotionRoomTypeRequest> promotionRoomTypeRequests;
}
