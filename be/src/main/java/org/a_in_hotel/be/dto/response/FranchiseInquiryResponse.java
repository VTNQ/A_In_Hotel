package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FranchiseInquiryResponse {
    private Long id;
    private String fullName;
    private String phone;
    private String email;
    private String province;
    private String propertyLocation;
    private String landArea;
    private String roomCount;
    private String message;
    private Boolean contacted;
    private OffsetDateTime createdAt;
}
