package org.a_in_hotel.be.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileSystemResponse {
    private Long id;
    private String email;
    private ImageResponse image;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    private OffsetDateTime createdAt;
    private Boolean isActive;
    private String phone;
    private String staffCode;
    private String fullName;
    private LocalDate birthday;
    private Integer gender;
    private String hotelName;
}
