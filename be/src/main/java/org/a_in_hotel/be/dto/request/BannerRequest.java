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
    @NotBlank(message = "Title must not be blank / Tiêu đề không được để trống")
    @Size(max = 255, message = "Title must be at most 255 characters / Tiêu đề chỉ được nhập tối đa 255 ký tự")
    private String name;
    @StartAtFutureOrPresent(message = "Start time must be from now or later / Thời gian bắt đầu phải từ hiện tại trở đi")
    private OffsetDateTime startAt;
    private OffsetDateTime endAt;
    @Size(max = 255, message = "CTA label must be at most 255 characters / Nhãn CTA chỉ được nhập tối đa 255 ký tự")
    private String ctaLabel;
    @Size(max = 500, message = "Description must be at most 500 characters / Mô tả chỉ được nhập tối đa 500 ký tự")
    private String description;

    @ImageFile(message = "Invalid image file / File ảnh không hợp lệ")
    private MultipartFile image;
}
