package org.a_in_hotel.be.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.Enum.HotelStatus;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.HotelRequest;
import org.a_in_hotel.be.dto.request.HotelUpdate;
import org.a_in_hotel.be.dto.response.FacilityResponse;
import org.a_in_hotel.be.dto.response.HotelResponse;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.dto.response.RoomTypeResponse;
import org.a_in_hotel.be.exception.ExceptionResponse;
import org.a_in_hotel.be.service.CategoryService;
import org.a_in_hotel.be.service.FacilityService;
import org.a_in_hotel.be.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@Tag(name = "Hotel")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class HotelController {
    @Autowired
    private HotelService hotelService;
    @Autowired
    private FacilityService facilityService;
    @Autowired
    private CategoryService categoryService;
    @Operation(summary = "Thêm khách sạn")
    @PostMapping("/create")
    public ResponseEntity<RequestResponse<Void>>create(@Valid @RequestBody HotelRequest hotelRequest, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            String errorMessage=bindingResult.getFieldErrors().stream()
                    .map(error->error.getDefaultMessage())
                    .findFirst()
                    .orElse("Dữ liệu không hợp lệ");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RequestResponse.error(errorMessage));
        }
        try {
            hotelService.save(hotelRequest);
            return ResponseEntity.ok(RequestResponse.success("Hotel created successfully"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
    @PutMapping("update/{id}")
    public ResponseEntity<RequestResponse<Void>>update(@Valid @RequestBody HotelUpdate hotelRequest, BindingResult bindingResult, @PathVariable Long id) {
        if(bindingResult.hasErrors()) {
            String errorMessage=bindingResult.getFieldErrors().stream()
                    .map(error->error.getDefaultMessage())
                    .findFirst()
                    .orElse("Dữ liệu không hợp lệ");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RequestResponse.error(errorMessage));
        }
        try {
            hotelService.update(hotelRequest,id);
            return ResponseEntity.ok(RequestResponse.success("Hotel updated successfully"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error("An error occurred: " + e.getMessage()));
        }
    }
    @PutMapping("updateStatus/{id}")
    public ResponseEntity<?>updateStatus(@RequestBody Integer hotelStatus, @PathVariable Long id) {
        try {
            hotelService.updateStatus(hotelStatus,id);
            return ResponseEntity.ok(RequestResponse.success("Hotel updated Status successfully"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse("An error occurred: " + e.getMessage()));
        }
    }
    @GetMapping
    public ResponseEntity<RequestResponse<PageResponse<HotelResponse>>>getAll(@RequestParam(defaultValue = "1") int page,
                                                                              @RequestParam(defaultValue = "5") int size,
                                                                              @RequestParam(defaultValue = "id,desc") String sort,
                                                                              @RequestParam(required = false) String filter,
                                                                              @RequestParam(required = false) String searchField,
                                                                              @RequestParam(required = false) String searchValue,
                                                                              @RequestParam(required = false) boolean all){
        try {
            return ResponseEntity.ok(RequestResponse.success(new PageResponse<>(hotelService.getAll(page, size, sort, filter, searchField, searchValue,all))));
        }catch (Exception e){
            return ResponseEntity.badRequest()
                    .body(RequestResponse.error( "Get All Config: " + e.getMessage()));
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse<HotelResponse>>getHotelById(@PathVariable Long id){
        try {
            return ResponseEntity.ok(RequestResponse.success(hotelService.getHotelById(id)));
        }catch (Exception e){
            return ResponseEntity.badRequest()
                    .body(RequestResponse.error( "Get Hotel Config: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/room-types")
    public ResponseEntity<RequestResponse<List<RoomTypeResponse>>> getRoomTypeByHotel(@PathVariable Long id){
        try {
            return ResponseEntity.ok(RequestResponse.success(
                    categoryService.getRoomTypesByHotel(id)
            ));
        }catch (Exception e){
            return ResponseEntity.badRequest()
                    .body(RequestResponse.error( "Get Room Type Config: " + e.getMessage()));
        }
    }
    @GetMapping("/facilities")
    public ResponseEntity<RequestResponse<List<FacilityResponse>>> getFacilities(){
        try {
            return ResponseEntity.ok(RequestResponse.success(
                    facilityService.getFacilitiesAndServices()));
        }catch (Exception e){
            return ResponseEntity.badRequest()
                    .body(RequestResponse.error( "Get Facility Config: " + e.getMessage()));
        }
    }
}
