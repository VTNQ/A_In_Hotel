package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.a_in_hotel.be.validator.EndAfterStart;

import java.time.Instant;

@Data
@EndAfterStart
public class BannerRequest {
    @NotBlank(message = "Tiêu đề không được để trống")
    private String name;
    @FutureOrPresent(message = "Thời gian bắt đầu phải từ hiện tại trở đi")
    private Instant startAt;
    private Instant endAt;
    private String ctaLabel;
    private String description;
}
