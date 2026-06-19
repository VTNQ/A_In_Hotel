package org.a_in_hotel.be.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FranchiseInquiryRequest {
    private String fullName;
    private String phone;
    private String email;
    private String province;
    private String investmentBudget;
    private String message;
}
