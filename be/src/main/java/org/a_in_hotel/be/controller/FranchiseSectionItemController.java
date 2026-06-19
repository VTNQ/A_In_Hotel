package org.a_in_hotel.be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.FranchiseSectionItemRequest;
import org.a_in_hotel.be.dto.response.FranchiseSectionItemResponse;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.service.FranchiseSectionItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/franchise-section-item")
@RequiredArgsConstructor
public class FranchiseSectionItemController {
    private final FranchiseSectionItemService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RequestResponse<Void>> createFranchiseSectionItem(
            @Valid @ModelAttribute FranchiseSectionItemRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        service.save(request, image);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(RequestResponse.success("franchise section item successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RequestResponse<Void>> update(
            @PathVariable Long id,
            @Valid @ModelAttribute FranchiseSectionItemRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image
    ){
        service.update(id,request,image);
        return ResponseEntity.ok(RequestResponse.success("franchise section item update successfully"));
    }
    @GetMapping
    public ResponseEntity<RequestResponse<PageResponse<FranchiseSectionItemResponse>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String searchField,
            @RequestParam(required = false) String searchValue,
            @RequestParam(required = false) boolean all
    ) {
        return ResponseEntity.ok(RequestResponse.success(new PageResponse<>
                (service.getAll(page, size, sort, filter, searchField, searchValue, all))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse<FranchiseSectionItemResponse>> getById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(RequestResponse.success(service.findById(id)));
    }
}
