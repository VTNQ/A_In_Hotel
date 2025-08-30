package com.example.hotelservice.controller;

import com.example.commonutils.api.PageResponse;
import com.example.commonutils.api.RequestResponse;
import com.example.hotelservice.Enum.HotelStatus;
import com.example.hotelservice.dto.request.HotelRequest;
import com.example.hotelservice.dto.request.HotelUpdate;
import com.example.hotelservice.dto.response.HotelResponse;
import com.example.hotelservice.exception.ExceptionResponse;
import com.example.hotelservice.service.HotelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/hotels")
@Tag(name = "Hotel")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class HotelController {
    @Autowired
    private HotelService hotelService;
    @Operation(summary = "Thêm khách sạn")
    @PostMapping("/create")
    public ResponseEntity<RequestResponse<Void>>create(@Valid @RequestBody HotelRequest hotelRequest, BindingResult bindingResult, @RequestHeader("Authorization") String authHeader) {
        if(bindingResult.hasErrors()) {
            String errorMessage=bindingResult.getFieldErrors().stream()
                    .map(error->error.getDefaultMessage())
                    .findFirst()
                    .orElse("Dữ liệu không hợp lệ");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RequestResponse.error(errorMessage));
        }
        try {
            hotelService.save(hotelRequest,authHeader);
            return ResponseEntity.ok(RequestResponse.success("Hotel created successfully"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error("An error occurred: " + e.getMessage()));
        }
    }
    @PutMapping("update/{id}")
    public ResponseEntity<RequestResponse<Void>>update(@Valid @RequestBody HotelUpdate hotelRequest,BindingResult bindingResult, @PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        if(bindingResult.hasErrors()) {
            String errorMessage=bindingResult.getFieldErrors().stream()
                    .map(error->error.getDefaultMessage())
                    .findFirst()
                    .orElse("Dữ liệu không hợp lệ");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RequestResponse.error(errorMessage));
        }
        try {
            hotelService.update(hotelRequest,id,authHeader);
            return ResponseEntity.ok(RequestResponse.success("Hotel updated successfully"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error("An error occurred: " + e.getMessage()));
        }
    }
    @PutMapping("updateStatus/{id}")
    public ResponseEntity<?>updateStatus(@RequestBody HotelStatus hotelStatus, @PathVariable Long id) {
        try {
            hotelService.updateStatus(hotelStatus,id);
            return ResponseEntity.ok(RequestResponse.success("Hotel updated Status successfully"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse("An error occurred: " + e.getMessage()));
        }
    }
    @GetMapping("getAll")
    public ResponseEntity<RequestResponse<PageResponse<HotelResponse>>>getAll(@RequestParam(defaultValue = "1") int page,
                                                                              @RequestParam(defaultValue = "5") int size,
                                                                              @RequestParam(defaultValue = "id,desc") String sort,
                                                                              @RequestParam(required = false) String filter,
                                                                              @RequestParam(required = false) String search,
                                                                              @RequestParam(required = false) boolean all){
        try {
            return ResponseEntity.ok(RequestResponse.success(new PageResponse<>(hotelService.getAll(page, size, sort, filter, search, all))));
        }catch (Exception e){
            return ResponseEntity.badRequest()
                    .body(RequestResponse.error( "Get All Config: " + e.getMessage()));
        }
    }
}
