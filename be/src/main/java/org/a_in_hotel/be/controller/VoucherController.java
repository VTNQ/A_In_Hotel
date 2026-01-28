package org.a_in_hotel.be.controller;

import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.PromotionRequest;
import org.a_in_hotel.be.dto.request.VoucherRequest;
import org.a_in_hotel.be.dto.response.RequestResponse;
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
        try {
            PageResponse<VoucherResponse> pageResponse =
                    new PageResponse<>(voucherService.getAll(page, size, sort, filter, searchField, searchValue, all));
            return ResponseEntity.ok(
                    RequestResponse.success(pageResponse)
            );
        }catch (Exception e){
            return ResponseEntity.badRequest()
                    .body(RequestResponse.error("Get all config :"+e.getMessage()));
        }
    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<RequestResponse<Void>>updateStatus(@PathVariable Long id,@RequestParam Boolean status){
        try {
            voucherService.updateStatus(id,status);
            return ResponseEntity.ok(RequestResponse.success("cập nhật trạng thái thành công"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<RequestResponse<Void>>update(@PathVariable Long id,@RequestBody VoucherRequest request){
        try {
            voucherService.update(request,id);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật voucher thành công"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse<VoucherResponse>> getVoucherById(@PathVariable Long id){
        try {
            return ResponseEntity.ok(RequestResponse.success(voucherService.getPromotionById(id)));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
    @PostMapping
    public ResponseEntity<RequestResponse<Void>> create(@RequestBody VoucherRequest request){
        try {
            voucherService.save(request);
            return ResponseEntity.ok(RequestResponse.success("Thêm mới voucher thành công"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
}
