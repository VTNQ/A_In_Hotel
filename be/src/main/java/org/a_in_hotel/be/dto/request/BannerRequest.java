package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.a_in_hotel.be.validator.EndAfterStart;
import org.a_in_hotel.be.validator.StartAtFutureOrPresent;

import java.time.LocalDate;


@Data
@EndAfterStart
public class BannerRequest {
    @NotBlank(message = "Tiêu đề không được để trống")
    private String name;
    @StartAtFutureOrPresent
    private LocalDate startAt;
    private LocalDate endAt;
    private String ctaLabel;
    private String description;
}
