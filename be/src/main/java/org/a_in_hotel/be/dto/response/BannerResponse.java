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
public class BannerResponse {

    private Long id;

    private String name;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private OffsetDateTime startAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private OffsetDateTime endAt;

    private String bannerCode;

    private String ctaLabel;

    private ImageResponse image;

    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    private OffsetDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    private OffsetDateTime updatedAt;
}
