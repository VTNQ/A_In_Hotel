package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
    public class FranchiseSectionItemResponse {
    private Long id;
    private Long sectionId;
    private String title;
    private String description;
    private ImageResponse icon;
    private Integer sortOrder;
    private Boolean active;
}
