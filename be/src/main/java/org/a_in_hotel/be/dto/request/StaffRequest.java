package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @NotNull(message = "Gender is required")
    private Integer gender;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^(03|05|07|08|09)[0-9]{8}$",
            message = "Invalid  phone number"
    )
    private String phone;

    @NotNull(message = "birthday is required")
    private LocalDate birthday;

    @NotNull(message = "Role is required")
    @Min(value = 1,message = "Role is required")
    private Long idRole;
    private Boolean isActive;
    private Long hotelId;
}
