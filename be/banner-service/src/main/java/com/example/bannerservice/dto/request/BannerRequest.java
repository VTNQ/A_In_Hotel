package com.example.bannerservice.dto.request;

import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class BannerRequest {
    private String name;
    private Instant startAt;
    private Instant endAt;
    private Integer priority;
    private String ctaLabel;
    private String description;
    private List<Long>categoryIds;
}
