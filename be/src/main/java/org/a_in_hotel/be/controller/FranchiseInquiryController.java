package org.a_in_hotel.be.controller;

import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.FranchiseInquiryRequest;
import org.a_in_hotel.be.dto.response.FranchiseInquiryResponse;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.service.FranchiseInquiryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/franchise-inquiry")
@RequiredArgsConstructor
public class FranchiseInquiryController {
    private final FranchiseInquiryService service;
    @PostMapping
    public ResponseEntity<RequestResponse<Void>> createFranchiseInquiry(@RequestBody FranchiseInquiryRequest request){
        service.save(request);
        return ResponseEntity.ok(RequestResponse.success("Franchise Inquiry save successfully"));
    }
    @GetMapping
    public ResponseEntity<RequestResponse<PageResponse<FranchiseInquiryResponse>>> getFranchise(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String searchField,
            @RequestParam(required = false) String searchValue,
            @RequestParam(required = false) boolean all
    ){
        return ResponseEntity.ok(RequestResponse.success(new PageResponse<>
                (service.getAll(page,size,sort,filter,searchField,searchValue,all))));
    }
    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse<FranchiseInquiryResponse>> getFranchiseInquiryById(@PathVariable Long id){
        return ResponseEntity.ok(RequestResponse.success(service.getById(id)));
    }
}
