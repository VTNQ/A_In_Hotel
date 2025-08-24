package com.phucnghia.dto.response;

import lombok.*;

import java.time.LocalTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ShiftResponse {
    private Long id;
    private String code;
    private LocalTime startTime;
    private LocalTime endTime;
    private String description;
}
