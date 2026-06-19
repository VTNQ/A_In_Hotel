package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FranchiseRequest {
    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    private String subTitle;

    private String description;

    private String primaryButtonText;

    private String primaryButtonUrl;

    private String secondaryButtonText;

    private String secondaryButtonUrl;

    private String metaTitle;

    private String metaDescription;

    private String metaKeywords;

    private Boolean active=true;
}
