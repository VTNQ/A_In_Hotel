package org.a_in_hotel.be.controller;

import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.PromotionRequest;
import org.a_in_hotel.be.dto.request.ValidateVoucherRequest;
import org.a_in_hotel.be.dto.request.VoucherRequest;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.dto.response.ValidateVoucherResponse;
import org.a_in_hotel.be.dto.response.VoucherResponse;
import org.a_in_hotel.be.service.VoucherService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vouchers")
public class VoucherController {

    private final VoucherService voucherService;

    @GetMapping
    public ResponseEntity<RequestResponse<PageResponse<VoucherResponse>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String searchField,
            @RequestParam(required = false) String searchValue,
            @RequestParam(required = false) boolean all
    ){

            PageResponse<VoucherResponse> pageResponse =
                    new PageResponse<>(voucherService.getAll(page, size, sort, filter, searchField, searchValue, all));
            return ResponseEntity.ok(
                    RequestResponse.success(pageResponse)
            );
    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<RequestResponse<Void>>updateStatus(@PathVariable Long id,@RequestParam Boolean status){

            voucherService.updateStatus(id,status);
            return ResponseEntity.ok(RequestResponse.success("cập nhật trạng thái thành công"));

    }
    @PutMapping("/{id}")
    public ResponseEntity<RequestResponse<Void>>update(@PathVariable Long id,@RequestBody VoucherRequest request){
            voucherService.update(request,id);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật voucher thành công"));

    }
    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse<VoucherResponse>> getVoucherById(@PathVariable Long id){

            return ResponseEntity.ok(RequestResponse.success(voucherService.getPromotionById(id)));

    }
    @PostMapping("/validate")
    public ResponseEntity<RequestResponse<ValidateVoucherResponse>> validateVoucher(@RequestBody ValidateVoucherRequest request){
        return ResponseEntity.ok(
            RequestResponse.success(voucherService.validateVoucher(request))
        );
    }
    @PostMapping
    public ResponseEntity<RequestResponse<Void>> create(@RequestBody VoucherRequest request){

            voucherService.save(request);
            return ResponseEntity.ok(RequestResponse.success("Thêm mới voucher thành công"));

    }
}
