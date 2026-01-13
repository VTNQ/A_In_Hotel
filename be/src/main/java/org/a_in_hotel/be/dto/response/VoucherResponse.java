package org.a_in_hotel.be.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherResponse {

    private Long id;

    private String voucherCode;

    private String voucherName;

    private Integer discountType;

    private Double discountValue;

    private Double minBookingAmount;

    private Double maxDiscount;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer usageLimit;

    private Integer usageCount;

    private Integer status;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    private OffsetDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    private OffsetDateTime updatedAt;
}
