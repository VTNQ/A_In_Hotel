package org.a_in_hotel.be.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class VoucherResponse {

    private Long id;

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

    private  Boolean stackWithPromotion;

    private Boolean stackWithOtherVoucher;

    private Integer priority;

    private Boolean isActive;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private OffsetDateTime createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private OffsetDateTime updatedAt;
    private String createdBy;
    private String updatedBy;

    private List<VoucherRoomTypeResponse> roomTypes;
}
