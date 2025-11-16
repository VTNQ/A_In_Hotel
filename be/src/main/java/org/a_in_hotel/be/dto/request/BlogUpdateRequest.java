package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogUpdateRequest {
    @NotBlank(message = "Title is required")
    @NotNull(message = "Title is required")
    private String title;
    @NotNull(message = "Category is required")
    private Integer category;
    private String description;
    private String content;
    @NotNull(message = "Status is required")
    private Integer status;

}
