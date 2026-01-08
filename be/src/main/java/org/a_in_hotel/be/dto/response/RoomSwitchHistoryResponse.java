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
public class RoomSwitchHistoryResponse {

    private Long id;

    private String fromRoomNumber;

    private String fromRoomName;

    private String fromRoomTypeName;

    private String toRoomNumber;

    private String toRoomTypeName;

    private String toRoomName;

    private String reason;

    private BigDecimal additionalPrice;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    private OffsetDateTime switchedAt;

}
