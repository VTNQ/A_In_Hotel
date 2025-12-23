package org.a_in_hotel.be.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDetailRequest {

    private Long roomId;

    private String specialRequests;

    private Long extraServiceId;



    private BigDecimal price;

}
