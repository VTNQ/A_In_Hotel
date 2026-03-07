package org.a_in_hotel.be.controller;

import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.PromotionRequest;
import org.a_in_hotel.be.dto.response.PromotionResponse;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.dto.response.RoomResponse;
import org.a_in_hotel.be.service.PromotionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService service;

    @PostMapping("/create")
    public ResponseEntity<RequestResponse<Void>> create(@RequestBody PromotionRequest request){
            service.save(request);
            return ResponseEntity.ok(RequestResponse.success("Thêm khuyến mãi thành công"));

    }
    @GetMapping
    public ResponseEntity<RequestResponse<PageResponse<PromotionResponse>>> getAll(@RequestParam(defaultValue = "1") int page,
                                                                                   @RequestParam(defaultValue = "5") int size,
                                                                                   @RequestParam(defaultValue = "id,desc") String sort,
                                                                                   @RequestParam(required = false) String filter,
                                                                                   @RequestParam(required = false) String searchField,
                                                                                   @RequestParam(required = false) String searchValue,
                                                                                   @RequestParam(required = false) boolean all) {

            PageResponse<PromotionResponse> pageResponse =
                    new PageResponse<>(service.getAll(page, size, sort, filter, searchField, searchValue, all));
            return ResponseEntity.ok(
                    RequestResponse.success(pageResponse)
            );

    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<RequestResponse<Void>> updateStatus(@PathVariable Long id,@RequestParam Boolean status){

            service.updateStatus(id,status);
            return ResponseEntity.ok(RequestResponse.success("cập nhật trạng thái thành công"));

    }
    @PutMapping("/{id}")
    public ResponseEntity<RequestResponse<Void>>update(@PathVariable Long id,@RequestBody PromotionRequest request){

            service.update(id,request);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật khuyến mãi thành công"));

    }
    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse<PromotionResponse>>getPromotionById(@PathVariable Long id){

            return ResponseEntity.ok(RequestResponse.success(service.findPromotionById(id)));

    }
}
