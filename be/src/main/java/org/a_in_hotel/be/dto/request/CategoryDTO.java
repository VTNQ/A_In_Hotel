package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.a_in_hotel.be.Enum.CategoryType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryDTO {

    @NotBlank(message = "Name is required / Tên danh mục không được để trống")
    @Size(max = 120, message = "Name must not exceed 120 characters / Tên danh mục không được vượt quá 120 ký tự")
    private String name;

    @Size(max = 255,message = "Description must be at most 500 characters / Mô tả chỉ được nhập tối đa 500 ký tự")
    private String description;

    @NotNull(message = "Type is required / Loại danh mục không được để trống")
    @Min(value = 1, message = "Invalid category type / Loại danh mục không hợp lệ")
    private Integer type;
}
