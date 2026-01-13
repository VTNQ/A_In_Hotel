package org.a_in_hotel.be.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherRequest {

    private String voucherName;

    private Integer discountType;

    private Double discountValue;

    private Double minBookingAmount;

    private Double maxDiscount;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer usageLimit;

    private Integer usageCount;
}
