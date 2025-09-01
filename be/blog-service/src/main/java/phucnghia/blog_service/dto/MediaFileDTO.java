package phucnghia.blog_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MediaFileDTO {
    private Long id;

    @NotBlank
    private String fileName;

    @NotBlank
    private String url;

    @Size(max = 120)
    private String contentType;

    private Long sizeBytes;

    private String altText;

    private Boolean active;

    private Long blogId; // tham chiếu Blog
}
