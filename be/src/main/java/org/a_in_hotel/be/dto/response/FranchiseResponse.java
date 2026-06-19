package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FranchiseResponse {

    private Long id;

    private String code;

    private String title;

    private String subTitle;

    private String slug;

    private String description;

    private ImageResponse bannerImage;

    private String primaryButtonText;

    private String primaryButtonUrl;

    private String secondaryButtonText;

    private String secondaryButtonUrl;

    private String metaTitle;

    private String metaDescription;

    private String metaKeywords;
    private Boolean active;

    private Long createdBy;

    private Long updatedBy;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;
}
