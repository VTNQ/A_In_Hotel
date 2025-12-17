package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FacilityResponse {
    private Long id;
    private String name;
    private String type;
    private ImageResponse image;
}
