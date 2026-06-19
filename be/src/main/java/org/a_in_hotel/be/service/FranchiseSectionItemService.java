package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.FranchiseSectionItemRequest;
import org.a_in_hotel.be.dto.response.FranchiseSectionItemResponse;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface FranchiseSectionItemService {

    void save(FranchiseSectionItemRequest request, MultipartFile file);

    void update(Long id,FranchiseSectionItemRequest request,MultipartFile file);

    Page<FranchiseSectionItemResponse> getAll(Integer page, Integer size, String sort, String filter, String searchField,
                                              String searchValue, boolean all);

    FranchiseSectionItemResponse findById(Long id);
}
