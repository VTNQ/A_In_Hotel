package org.a_in_hotel.be.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionResponse {
    private Long id;

    private String name;

    private Integer type;

    private BigDecimal value;

    private String code;

    private Integer priority;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean isActive;

    private List<PromotionRoomTypeResponse> promotionRoomTypeResponses;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") // XXX = +07:00
    private OffsetDateTime createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private OffsetDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
}
