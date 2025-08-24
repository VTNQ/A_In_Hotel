package com.phucnghia.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AssignmentResponse {
    private Long id;

    private Long staffId;
    private String staffName;

    private Long shiftId;
    private String shiftCode;
    private LocalTime startTime;
    private LocalTime endTime;

    private LocalDate workDate;
    private String note;
}
