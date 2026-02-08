package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.response.BookingSummaryResponse;
import org.a_in_hotel.be.dto.response.CustomerResponse;
import org.a_in_hotel.be.dto.response.DetailCustomerResponse;
import org.springframework.data.domain.Page;

public interface CustomerService {
    Page<CustomerResponse> getListCustomer(
            Integer page,
            Integer size,
            String sort,
            String filter,
            String searchField,
            String searchValue,
            boolean all
    );
    void updateStatus(Long id,Boolean blocked);
    DetailCustomerResponse getCustomerDetail(Long customerId);

    BookingSummaryResponse getCustomerBookingSummary(Long customerId);
}
