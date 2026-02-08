package org.a_in_hotel.be.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RewardTransactionResponse {
    private Long id;
    private String transactionCode;
    private String bookingCode;
    private Integer points;
    private Integer type;
    private Integer balanceBefore;
    private Integer balanceAfter;
    private String description;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private OffsetDateTime createdAt;
}
