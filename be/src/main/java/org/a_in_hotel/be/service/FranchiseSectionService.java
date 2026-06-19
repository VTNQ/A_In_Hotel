package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.FranchiseSectionRequest;
import org.a_in_hotel.be.dto.response.FranchiseSectionResponse;
import org.springframework.data.domain.Page;

public interface FranchiseSectionService {
    void save(FranchiseSectionRequest request);

    Page<FranchiseSectionResponse> getAll(Integer page, Integer size, String sort, String filter, String searchField,
                                          String searchValue, boolean all);

    void update(FranchiseSectionRequest request,Long id);

    FranchiseSectionResponse findFranchiseSectionById(Long id);

    void updateStatus(Long id,Boolean status);
}
