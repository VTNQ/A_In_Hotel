package com.example.hotelservice.controller;

import com.example.hotelservice.Enum.HotelStatus;
import com.example.hotelservice.dto.RequestResponse;
import com.example.hotelservice.dto.request.HotelRequest;
import com.example.hotelservice.dto.request.HotelUpdate;
import com.example.hotelservice.dto.response.PageResponse;
import com.example.hotelservice.exception.ExceptionResponse;
import com.example.hotelservice.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hotel")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class HotelController {
    @Autowired
    private HotelService hotelService;
    @PostMapping("/create")
    public ResponseEntity<?>create(@RequestBody HotelRequest hotelRequest, @RequestHeader("Authorization") String authHeader) {
        try {
            hotelService.save(hotelRequest,authHeader);
            return ResponseEntity.ok(new RequestResponse("Hotel created successfully"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse("An error occurred: " + e.getMessage()));
        }
    }
    @PutMapping("update/{id}")
    public ResponseEntity<?>update(@RequestBody HotelUpdate hotelRequest, @PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        try {
            hotelService.update(hotelRequest,id,authHeader);
            return ResponseEntity.ok(new RequestResponse("Hotel updated successfully"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse("An error occurred: " + e.getMessage()));
        }
    }
    @PutMapping("updateStatus/{id}")
    public ResponseEntity<?>updateStatus(@RequestBody HotelStatus hotelStatus, @PathVariable Long id) {
        try {
            hotelService.updateStatus(hotelStatus,id);
            return ResponseEntity.ok(new RequestResponse("Hotel updated Status successfully"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse("An error occurred: " + e.getMessage()));
        }
    }
    @GetMapping("getAll")
    public ResponseEntity<?>getAll(@RequestParam(defaultValue = "1") int page,
                                   @RequestParam(defaultValue = "5") int size,
                                   @RequestParam(defaultValue = "id,desc") String sort,
                                   @RequestParam(required = false) String filter,
                                   @RequestParam(required = false) String search,
                                   @RequestParam(required = false) boolean all){
        try {
            return ResponseEntity.ok(new PageResponse<>(hotelService.getAll(page, size, sort, filter, search, all)));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse("An error occurred: " + e.getMessage()));
        }
    }
}
