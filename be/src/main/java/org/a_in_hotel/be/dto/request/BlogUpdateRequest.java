package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogUpdateRequest {
    @NotBlank(message = "Title is required")
    @NotNull(message = "Title is required")
    @Size(max = 255, message = "Title must be at most 255 characters / Tiêu đề chỉ được nhập tối đa 255 ký tự")
    private String title;
    @NotNull(message = "Category is required / Danh mục là bắt buộc")
    private Integer category;
    @Size(max = 500, message = "Description must be at most 500 characters / Mô tả chỉ được nhập tối đa 500 ký tự")
    private String description;
    @Size(max = 10000, message = "Content is too long / Content hiện tại quá dài")
    private String content;
    @NotNull(message = "Status is required")
    private Integer status;

}
