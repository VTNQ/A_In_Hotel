package com.phucnghia.dto.request;

import com.phucnghia.enums.StaffRole;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StaffRequest {

    @NotBlank
    private String fullName;

    private String phone;

    @Email
    private String email;

    @NotNull
    private StaffRole role;

    @NotNull @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal salary;

    private Boolean active = true;
}
