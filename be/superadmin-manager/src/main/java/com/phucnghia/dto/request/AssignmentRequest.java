package com.phucnghia.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AssignmentRequest {

    @NotNull private Long staffId;
    @NotNull private Long shiftId;
    @NotNull private LocalDate workDate;

    private String note;
}
