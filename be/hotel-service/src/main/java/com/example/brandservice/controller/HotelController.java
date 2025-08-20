package com.example.brandservice.controller;

import com.example.brandservice.Enum.HotelStatus;
import com.example.brandservice.dto.RequestResponse;
import com.example.brandservice.dto.request.HotelRequest;
import com.example.brandservice.exception.ExceptionResponse;
import com.example.brandservice.service.HotelService;
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
    public ResponseEntity<?>update(@RequestBody HotelRequest hotelRequest, @PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
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
}
