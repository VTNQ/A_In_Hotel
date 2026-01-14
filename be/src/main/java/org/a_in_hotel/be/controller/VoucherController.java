package org.a_in_hotel.be.controller;

import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.VoucherRequest;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.dto.response.VoucherResponse;
import org.a_in_hotel.be.service.VoucherService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService service;

    @PostMapping
    public ResponseEntity<RequestResponse<Void>> create(@RequestBody VoucherRequest request) {
        try {
            service.create(request);
            return ResponseEntity.ok(RequestResponse.success("Voucher create successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<RequestResponse<Void>> update(@PathVariable Long id,
                                                        @RequestBody VoucherRequest request){
        try {
            service.update(id,request);
            return ResponseEntity.ok(RequestResponse.success("Voucher update successfully"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<RequestResponse<PageResponse<VoucherResponse>>> getAll(@RequestParam(defaultValue = "1") int page,
                                                                                 @RequestParam(defaultValue = "5") int size,
                                                                                 @RequestParam(defaultValue = "id,desc") String sort,
                                                                                 @RequestParam(required = false) String filter,
                                                                                 @RequestParam(required = false) String searchField,
                                                                                 @RequestParam(required = false) String searchValue,
                                                                                 @RequestParam(required = false) boolean all){
        try {
            PageResponse<VoucherResponse> pageResponse =
                    new PageResponse<>(service.getAll(page,size,sort,filter,searchField,searchValue,all));
            return ResponseEntity.ok(
                    RequestResponse.success(pageResponse)
            );
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse<VoucherResponse>>findById(@PathVariable Long id){
        try {
            return ResponseEntity.ok(RequestResponse.success(service.findVoucherById(id)));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<RequestResponse<Void>>changeStatus(@PathVariable Long id,@RequestParam Integer status){
        try {
            service.changeStatus(id,status);
            return ResponseEntity.ok(RequestResponse.success("Change status successfully"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

}
