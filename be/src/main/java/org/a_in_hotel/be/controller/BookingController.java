package org.a_in_hotel.be.controller;

import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.BookingRequest;
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
}
