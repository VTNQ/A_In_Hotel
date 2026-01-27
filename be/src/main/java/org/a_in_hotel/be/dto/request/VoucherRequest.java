package org.a_in_hotel.be.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherRequest {

    private String voucherCode;

    private String voucherName;

    private Integer type;

    private String description;

    private BigDecimal value;

    private BigDecimal maxDiscountValue;

    private Integer bookingType;

    private Integer minimumStay;

    private Integer customerType;

    private Integer usageType;

    private Integer usageLimit;

    private Integer usagePerCustomer;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean stackWithPromotion;

    private Boolean stackWithOtherVoucher;

    private Integer priority;

    private List<VoucherRoomTypeRequest> roomTypes;
}
