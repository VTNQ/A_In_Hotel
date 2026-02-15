package org.a_in_hotel.be.controller;

import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.response.*;
import org.a_in_hotel.be.service.BookingStatisticsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final BookingStatisticsService bookingStatisticsService;

    @GetMapping("/bookings")
    public ResponseEntity<RequestResponse<BookingStatisticsResponse>> getBookings(){
        try {
            return ResponseEntity.ok(RequestResponse.success(bookingStatisticsService.getBookingStatistics()));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
    @GetMapping("/rooms")
    public ResponseEntity<RequestResponse<RoomAvailabilityResponse>> getRoomsAvailability(){
        try {
            return ResponseEntity.ok(RequestResponse.success(bookingStatisticsService.getRoomAvailability()));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
    @GetMapping("/revenue")
    public ResponseEntity<RequestResponse<List<RevenueStatisticsResponse>>> getRevenue(){
        try {
            return ResponseEntity.ok(RequestResponse.success(bookingStatisticsService.getRevenue()));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/booking/reservation")
    public ResponseEntity<RequestResponse<List<ReservationStatisticsResponse>>> getReservation(){
        try {
            return ResponseEntity.ok(RequestResponse.success(bookingStatisticsService.getReservation()));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
}
