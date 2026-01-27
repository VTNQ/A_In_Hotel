package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.PromotionRequest;
import org.a_in_hotel.be.dto.request.VoucherRequest;
import org.a_in_hotel.be.dto.response.VoucherResponse;
import org.springframework.data.domain.Page;

public interface VoucherService {

    void save(VoucherRequest request);

    Page<VoucherResponse> getAll(Integer page, Integer size,
                                 String sort, String filter,
                                 String searchField, String searchValue, boolean all);

    void update(VoucherRequest request,Long id);
    VoucherResponse getPromotionById(Long id);
    void updateStatus(Long id,Boolean status);
}
