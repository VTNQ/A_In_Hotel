package org.a_in_hotel.be.controller;

import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.response.BookingSummaryResponse;
import org.a_in_hotel.be.dto.response.CustomerResponse;
import org.a_in_hotel.be.dto.response.DetailCustomerResponse;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService service;

    @GetMapping
    public ResponseEntity<RequestResponse<PageResponse<CustomerResponse>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String searchField,
            @RequestParam(required = false) String searchValue,
            @RequestParam(required = false) boolean all
    ){
        try {
            PageResponse<CustomerResponse> pageResponse =
                    new PageResponse<>(service.getListCustomer(page,size,sort,filter,searchField,searchValue,all));
            return ResponseEntity.ok(RequestResponse.success(pageResponse));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<DetailCustomerResponse> getDetailCustomer(
            @PathVariable Long id
    ){
        return ResponseEntity.ok(service.getCustomerDetail(id));
    }
    @GetMapping("/summary")
    public ResponseEntity<RequestResponse<BookingSummaryResponse>> getBookingSummary(
            @RequestParam Long customerId
    ){
        return ResponseEntity.ok(RequestResponse.success(
                service.getCustomerBookingSummary(customerId)
        ));
    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<RequestResponse<Void>> updateStatus(
            @PathVariable Long id,
            @RequestParam Boolean status
    ){
        try {
            service.updateStatus(id,status);
            return ResponseEntity.ok(RequestResponse.success("customer status successfully"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
}
