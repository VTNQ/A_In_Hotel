package org.a_in_hotel.be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.request.FranchiseRequest;
import org.a_in_hotel.be.dto.response.FranchiseResponse;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.service.FranchiseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/franchises")
@RequiredArgsConstructor
public class FranchiseController {
    private final FranchiseService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RequestResponse<Void>> saveOrUpdate(@Valid @ModelAttribute FranchiseRequest request,
                                                              @RequestParam(value = "image", required = false) MultipartFile image){
        service.saveOrUpdate(request,image);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(RequestResponse.success("franchise successfully"));
    }
    @GetMapping
    public ResponseEntity<RequestResponse<FranchiseResponse>> getFranchise(){
        return ResponseEntity.ok(RequestResponse.success(service.getFranchise()));
    }
}
