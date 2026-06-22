package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.a_in_hotel.be.entity.FranchiseSectionItem;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FranchiseSectionResponse {
    private Long id;
    private String code;
    private String title;
    private String subTitle;
    private String description;
    private Integer sortOrder;
    private Boolean active;
    private List<FranchiseSectionItemResponse> items;
}
