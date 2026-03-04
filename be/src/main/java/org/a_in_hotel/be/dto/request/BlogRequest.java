package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.a_in_hotel.be.annotation.ImageFile;
import org.a_in_hotel.be.annotation.RequiredImage;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogRequest {
    @NotBlank(message = "Tiêu đề không được để trống")
    @NotNull(message = "Tiêu đề là bắt buộc")
    @Size(max = 255, message = "Tiêu đề phải có tối đa 255 ký tự")
    private String title;
    @NotNull(message = "Danh mục là bắt buộc")
    private Integer category;
    private String description;
    private String content;

    @NotNull(message = "Danh mục là bắt buộc")
    private Integer status;
    @ImageFile(message = "File ảnh không hợp lệ")
    private MultipartFile image;
}
