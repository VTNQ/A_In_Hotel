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
        try {
            service.save(request);
            return ResponseEntity.ok(RequestResponse.success("Thêm khuyến mãi thành công"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
    @GetMapping
    public ResponseEntity<RequestResponse<PageResponse<PromotionResponse>>> getAll(@RequestParam(defaultValue = "1") int page,
                                                                                   @RequestParam(defaultValue = "5") int size,
                                                                                   @RequestParam(defaultValue = "id,desc") String sort,
                                                                                   @RequestParam(required = false) String filter,
                                                                                   @RequestParam(required = false) String searchField,
                                                                                   @RequestParam(required = false) String searchValue,
                                                                                   @RequestParam(required = false) boolean all) {
        try {
            PageResponse<PromotionResponse> pageResponse =
                    new PageResponse<>(service.getAll(page, size, sort, filter, searchField, searchValue, all));
            return ResponseEntity.ok(
                    RequestResponse.success(pageResponse)
            );
        }catch (Exception e){
            return ResponseEntity.badRequest()
                    .body(RequestResponse.error("Get All Config: " + e.getMessage()));
        }
    }
}
