package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.Enum.RoomStatus;
import org.a_in_hotel.be.dto.response.*;
import org.a_in_hotel.be.entity.Booking;
import org.a_in_hotel.be.entity.BookingDetail;
import org.a_in_hotel.be.mapper.BookingDetailMapper;
import org.a_in_hotel.be.repository.BookingDetailRepository;
import org.a_in_hotel.be.repository.BookingRepository;
import org.a_in_hotel.be.repository.RoomRepository;
import org.a_in_hotel.be.service.BookingStatisticsService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingStatisticsServiceImpl implements BookingStatisticsService {

    private final BookingRepository bookingRepository;

    private final RoomRepository roomRepository;


    private final SecurityUtils securityUtils;


    @Override
    public BookingStatisticsResponse getBookingStatistics() {
        OffsetDateTime now = OffsetDateTime.now();

        OffsetDateTime startOfWeek = now
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .with(LocalTime.MIN);
        OffsetDateTime endOfWeek = startOfWeek.plusDays(7);

        OffsetDateTime startOfLastWeek = startOfWeek.minusWeeks(1);
        OffsetDateTime endOfLastWeek = startOfWeek;

        Long currentBooking = bookingRepository
                .countBookingBetween(startOfWeek, endOfWeek, securityUtils.getHotelId());

        Long lastBooking = bookingRepository
                .countBookingBetween(startOfLastWeek, endOfLastWeek, securityUtils.getHotelId());

        double bookingPercent = calculatePercent(currentBooking, lastBooking);
        Long currentCheckIn = bookingRepository
                .countCheckInBetween(startOfWeek, endOfWeek, securityUtils.getHotelId());

        Long lastCheckIn = bookingRepository
                .countCheckInBetween(startOfLastWeek, endOfLastWeek, securityUtils.getHotelId());

        double checkInPercent = calculatePercent(currentCheckIn, lastCheckIn);

        // ===== CHECK OUT =====
        Long currentCheckOut = bookingRepository
                .countCheckOutBetween(startOfWeek, endOfWeek, securityUtils.getHotelId());

        Long lastCheckOut = bookingRepository
                .countCheckOutBetween(startOfLastWeek, endOfLastWeek, securityUtils.getHotelId());

        double checkOutPercent = calculatePercent(currentCheckOut, lastCheckOut);

        // ===== REVENUE =====
        BigDecimal currentRevenue = bookingRepository
                .sumRevenueBetween(startOfWeek, endOfWeek, securityUtils.getHotelId());

        BigDecimal lastRevenue = bookingRepository
                .sumRevenueBetween(startOfLastWeek, endOfLastWeek, securityUtils.getHotelId());

        double revenuePercent = calculatePercent(
                currentRevenue.doubleValue(),
                lastRevenue.doubleValue()
        );

        return new BookingStatisticsResponse(
                currentBooking, bookingPercent,
                currentCheckIn, checkInPercent,
                currentCheckOut, checkOutPercent,
                currentRevenue, revenuePercent
        );

    }

    @Override
    public RoomAvailabilityResponse getRoomAvailability() {
        Long total = roomRepository.countTotalRooms(securityUtils.getHotelId());
        Long available = roomRepository.countByStatus(securityUtils.getHotelId(), RoomStatus.AVAILABLE.getCode());
        Long reserved = roomRepository.countByStatus(securityUtils.getHotelId(), RoomStatus.RESERVED.getCode());
        Long occupied = roomRepository.countByStatus(securityUtils.getHotelId(), RoomStatus.OCCUPIED.getCode());
        Long notReady = roomRepository.countByStatus(securityUtils.getHotelId(), RoomStatus.MAINTENANCE.getCode());
        return new RoomAvailabilityResponse(
                total,
                available,
                reserved,
                occupied,
                notReady
        );
    }

    @Override
    public List<RevenueStatisticsResponse> getRevenue() {
        OffsetDateTime DaysAgo = OffsetDateTime.now().minusDays(7);

        List<Object[]> result =
                bookingRepository.getRevenueLast(DaysAgo);

        return result.stream()
                .map(r -> new RevenueStatisticsResponse(
                        r[0].toString(),
                        (BigDecimal) r[1]
                ))
                .toList();
    }

    @Override
    public List<ReservationStatisticsResponse> getReservation() {
        OffsetDateTime sevenDaysAgo = OffsetDateTime.now().minusDays(7);

        return bookingRepository.getReservation(sevenDaysAgo,securityUtils.getHotelId())
                .stream()
                .map(r -> new ReservationStatisticsResponse(
                        r[0].toString(),
                        ((Number) r[1]).longValue(),
                        ((Number) r[2]).longValue()
                ))
                .toList();
    }



    private double calculatePercent(double current, double previous) {
        if (previous == 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    }
}
