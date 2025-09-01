package phucnghia.blog_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryDTO {
    private Long id;

    @NotBlank
    @Size(max = 120)
    private String name;

    @Size(max = 160)
    private String slug;

    @Size(max = 500)
    private String description;

    private Boolean active;
}
