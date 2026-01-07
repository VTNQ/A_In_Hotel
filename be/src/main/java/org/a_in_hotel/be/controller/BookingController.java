package org.a_in_hotel.be.controller;

import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.BookingRequest;
import org.a_in_hotel.be.dto.request.CheckOutRequest;
import org.a_in_hotel.be.dto.request.EditGuestRequest;
import org.a_in_hotel.be.dto.request.SwitchRoomRequest;
import org.a_in_hotel.be.dto.response.BookingResponse;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class BookingController {

    private final BookingService service;

    @PostMapping
    public ResponseEntity<RequestResponse<Void>> create(@RequestBody BookingRequest request){

        service.create(request);

        return ResponseEntity.ok(RequestResponse.success("Booking created successfully"));
    }

    @GetMapping
    public  ResponseEntity<RequestResponse<PageResponse<BookingResponse>>> getBookings
            (
                    @RequestParam(defaultValue = "1") int page,
                    @RequestParam(defaultValue = "5") int size,
                    @RequestParam(defaultValue = "id,desc") String sort,
                    @RequestParam(required = false) String filter,
                    @RequestParam(required = false) String searchField,
                    @RequestParam(required = false) String searchValue,
                    @RequestParam(required = false) boolean all
            ){
        PageResponse<BookingResponse> pageResponse =
                new PageResponse<>(service.findAll(page,size,sort,filter,searchField,searchValue,all));
        return ResponseEntity.ok(RequestResponse.success(pageResponse));
    }
    @GetMapping("/{id}/active-details")
    public ResponseEntity<RequestResponse<BookingResponse>> findByIdAndDetailsActiveTrue(
            @PathVariable Long id
    ){
        return ResponseEntity.ok(RequestResponse.success(service.findByIdAndDetailsActiveTrue(id)));
    }
    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse<BookingResponse>> getBookingById
            (
                    @PathVariable Long id
            ){
        return ResponseEntity.ok(RequestResponse.success(service.findById(id)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<RequestResponse<Void>> editInformation(@PathVariable Long id, @RequestBody EditGuestRequest request){
        service.updateGuestInformation(id,request);
        return ResponseEntity.ok(RequestResponse.success("Booking updated successfully!"));
    }

    @PatchMapping("/{id}/check-in")
    public ResponseEntity<RequestResponse<Void>> checkIn(@PathVariable Long id){
        service.confirmCheckIn(id);
        return ResponseEntity.ok(RequestResponse.success("Check-in successfully"));
    }

    @PatchMapping("/{id}/check-out")
    public ResponseEntity<RequestResponse<Void>> checkOut(@PathVariable Long id, @RequestBody CheckOutRequest request){
        service.confirmCheckOut(id,request);

        return ResponseEntity.ok(RequestResponse.success("Booking Check-out successfully"));
    }

    @PatchMapping("/{id}/switch-room")
    public ResponseEntity<RequestResponse<Void>> switchRoom(@PathVariable Long id, @RequestBody SwitchRoomRequest request){
        service.switchRoom(id,request);

        return ResponseEntity.ok(RequestResponse.success("Booking switch-room successfully"));
    }
}
