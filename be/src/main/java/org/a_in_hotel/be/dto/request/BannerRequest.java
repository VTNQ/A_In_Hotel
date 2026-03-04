package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.a_in_hotel.be.annotation.ImageFile;
import org.a_in_hotel.be.validator.EndAfterStart;
import org.a_in_hotel.be.validator.StartAtFutureOrPresent;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.OffsetDateTime;


@Data
@EndAfterStart
public class BannerRequest {
    @NotBlank(message = "Tiêu đề không được để trống")
    private String name;
    @StartAtFutureOrPresent
    private OffsetDateTime startAt;
    private OffsetDateTime endAt;
    @NotBlank(message = "Nội dung không được để trống")
    @Size(max = 500, message = "Nội dung không được vượt quá 500 ký tự")
    private String ctaLabel;

    private String description;

    @ImageFile(message = "File ảnh không hợp lệ")
    private MultipartFile image;
}
