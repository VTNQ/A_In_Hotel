package org.a_in_hotel.be.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerAggregateDTO {
    private Long id;
    private String customerCode;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private Integer totalCompletedBookings;
    private BigDecimal rewardBalance;
    private Boolean blocked;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private OffsetDateTime lastBookingAt;
}
