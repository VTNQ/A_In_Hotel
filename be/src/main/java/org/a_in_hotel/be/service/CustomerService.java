package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.CustomerUpdateProfileDTO;
import org.a_in_hotel.be.dto.response.BookingSummaryResponse;
import org.a_in_hotel.be.dto.response.CustomerResponse;
import org.a_in_hotel.be.dto.response.DetailCustomerResponse;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

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
    void updateCustomerProfile(CustomerUpdateProfileDTO request, MultipartFile file);
}
