package org.a_in_hotel.be.dto.request;

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
