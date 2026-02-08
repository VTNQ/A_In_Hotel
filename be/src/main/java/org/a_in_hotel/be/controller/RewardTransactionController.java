package org.a_in_hotel.be.controller;

import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.dto.response.RewardTransactionResponse;
import org.a_in_hotel.be.service.RewardTransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reward-transaction")
@RequiredArgsConstructor
public class RewardTransactionController {
    private final RewardTransactionService service;
    @GetMapping
    public ResponseEntity<RequestResponse<PageResponse<RewardTransactionResponse>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String searchField,
            @RequestParam(required = false) String searchValue,
            @RequestParam(required = false) boolean all
    ){
        try {
            PageResponse<RewardTransactionResponse> pageResponse =
                    new PageResponse<>(service.getRewardTransaction(page,size,sort,filter,searchField,searchValue,all));
            return ResponseEntity.ok(RequestResponse.success(pageResponse));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
}
