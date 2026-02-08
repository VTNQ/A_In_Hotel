package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetailCustomerResponse {
    private String customerCode;
    private String phone;
    private String email;
    private String fullName;
    private String nationality;
    private Integer totalPoint;
    private Integer availablePoint;
    private Integer usedPoint;
    private Boolean blocked;
}
