package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class BannerUpdateDTO {
    @NotBlank(message = "Tiêu đề không được để trống")
    private String name;
    private OffsetDateTime startAt;
    private OffsetDateTime endAt;
    private String ctaLabel;
    private String description;
}
