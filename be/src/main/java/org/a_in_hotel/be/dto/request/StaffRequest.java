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

    @NotBlank(message = "Email is required / Email không được để trống")
    @Email(message = "Invalid email format / Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Full name is required / Họ và tên không được để trống")
    private String fullName;

    @NotNull(message = "Gender is required / Giới tính không được để trống")
    private Integer gender;

    @NotBlank(message = "Phone number is required / Số điện thoại không được để trống")
    @Pattern(
            regexp = "^(03|05|07|08|09)[0-9]{8}$",
            message = "Invalid phone number / Số điện thoại không hợp lệ"
    )
    private String phone;

    @NotNull(message = "Birthday is required / Ngày sinh không được để trống")
    private LocalDate birthday;

    @NotNull(message = "Role is required / Vai trò không được để trống")
    @Min(value = 1, message = "Role must be valid / Vai trò không hợp lệ")
    private Long idRole;
    private Boolean isActive;
    private Long hotelId;
}
