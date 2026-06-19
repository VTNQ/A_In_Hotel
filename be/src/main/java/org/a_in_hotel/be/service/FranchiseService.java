package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.FranchiseRequest;
import org.a_in_hotel.be.dto.response.FranchiseResponse;
import org.springframework.web.multipart.MultipartFile;

public interface FranchiseService {
    void saveOrUpdate(FranchiseRequest request, MultipartFile file);

    FranchiseResponse getFranchise();
}
