package com.phucnghia.dto.response;

import com.phucnghia.enums.StaffRole;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StaffResponse {
    private Long id;
    private String fullName;
    private String phone;
    private String email;
    private StaffRole role;
    private BigDecimal salary;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
