package org.a_in_hotel.be.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemContentResponse {

    private Long id;

    private String title;

    private Integer contentKey;

    private String description;

    private String ctaText;

    private ImageResponse backgroundImage;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    private OffsetDateTime updatedBy;

    private String updatedAt;


}
