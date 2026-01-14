package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.VoucherRequest;
import org.a_in_hotel.be.dto.response.VoucherResponse;
import org.springframework.data.domain.Page;

public interface VoucherService {

    void create(VoucherRequest request);

    void update(Long id,VoucherRequest request);

    Page<VoucherResponse> getAll(Integer page,
                                 Integer size,
                                 String sort,
                                 String filter,
                                 String searchField,
                                 String searchValue,
                                 boolean all);

    VoucherResponse findVoucherById(Long id);

    void changeStatus(Long id,Integer status);
}
