package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.FranchiseInquiryRequest;
import org.a_in_hotel.be.dto.response.FranchiseInquiryResponse;
import org.springframework.data.domain.Page;

public interface FranchiseInquiryService {
    void save(FranchiseInquiryRequest request);

    Page<FranchiseInquiryResponse> getAll(
            Integer page, Integer size, String sort, String filter, String searchField,
            String searchValue, boolean all
    );

    FranchiseInquiryResponse getById(Long id);

}
