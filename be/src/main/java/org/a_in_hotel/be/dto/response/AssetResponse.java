package org.a_in_hotel.be.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.a_in_hotel.be.Enum.AssetStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class AssetResponse {
    private Long id;
    private String assetCode;
    private String assetName;

    private Long categoryId;
    private String categoryName;

    private Long hotelId;
    private Long roomId;
    private String roomNumber;
    private BigDecimal price;
    private Integer quantity;

    private Integer status;
    private String note;
    private String hotelName;

    private ImageResponse thumbnail;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private OffsetDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private OffsetDateTime updatedAt;
}
