package com.example.bannerservice.dto.request;

import com.example.bannerservice.validator.EndAfterStart;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.Instant;
import java.util.List;

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
