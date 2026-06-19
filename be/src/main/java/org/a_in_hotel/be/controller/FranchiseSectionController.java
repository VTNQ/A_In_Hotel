package org.a_in_hotel.be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.FranchiseSectionRequest;
import org.a_in_hotel.be.dto.response.FranchiseSectionResponse;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.service.FranchiseSectionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/franchise-section")
@RequiredArgsConstructor
public class FranchiseSectionController {
    private final FranchiseSectionService service;
    @PostMapping
    public ResponseEntity<RequestResponse<Void>> createFranchiseSection(@Valid @RequestBody FranchiseSectionRequest request){
        service.save(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(RequestResponse.success("create franchise section successfully"));
    }
    @GetMapping
    public ResponseEntity<RequestResponse<PageResponse<FranchiseSectionResponse>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String searchField,
            @RequestParam(required = false) String searchValue,
            @RequestParam(required = false) boolean all
    ){
        return ResponseEntity.ok(RequestResponse.success(new PageResponse<>(service.getAll(page, size, sort, filter, searchField, searchValue, all))));
    }
    @PutMapping("/{id}")
    public ResponseEntity<RequestResponse<Void>> update(@PathVariable Long id,@RequestBody FranchiseSectionRequest request){
        service.update(request,id);
        return ResponseEntity.ok(RequestResponse.success("update franchise section successfully"));
    }
    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse<FranchiseSectionResponse>> getFranchiseSectionById(
            @PathVariable Long id
    ){
        return ResponseEntity.ok(RequestResponse.success(service.findFranchiseSectionById(id)));
    }
    @PatchMapping("/updateStatus/{id}")
    public ResponseEntity<RequestResponse<Void>> updateStatus(
            @PathVariable Long id,
            @RequestParam Boolean status
    ){
        service.updateStatus(id,status);
        return ResponseEntity.ok(RequestResponse.success("Update status successfully"));
    }
}
