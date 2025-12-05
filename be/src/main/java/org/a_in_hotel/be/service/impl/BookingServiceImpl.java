package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.Enum.BookingPackage;
import org.a_in_hotel.be.dto.request.BookingDetailRequest;
import org.a_in_hotel.be.dto.request.BookingRequest;
import org.a_in_hotel.be.dto.response.BookingResponse;
import org.a_in_hotel.be.entity.Booking;
import org.a_in_hotel.be.mapper.BookingDetailMapper;
import org.a_in_hotel.be.mapper.BookingMapper;
import org.a_in_hotel.be.repository.BookingRepository;
import org.a_in_hotel.be.repository.ExtraServiceRepository;
import org.a_in_hotel.be.repository.RoomRepository;
import org.a_in_hotel.be.service.BookingService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingServiceImpl  implements BookingService {

    private final BookingRepository repository;

    private final BookingMapper mapper;

    private final BookingDetailMapper detailMapper;

    private final RoomRepository roomRepository;

    private final ExtraServiceRepository extraServiceRepository;

    private final SecurityUtils securityUtils;

    private static final List<String> SEARCH_FIELDS =  List.of("code","phoneNumber");
    @Override
    public void create(BookingRequest request) {

        validateBookingTime(request);

        validateRoomSchedule(request);
        Booking booking = mapper.toEntity
                (request,detailMapper,roomRepository,extraServiceRepository,securityUtils.getCurrentUserId());

        repository.save(booking);
        log.info("Booking created {} details",
                 booking.getDetails() != null ? booking.getDetails().size() : 0);
    }

    @Override
    public Page<BookingResponse> findAll(
            Integer page, Integer size, String sort, String filter, String searchField,
            String searchValue, boolean all
                                        ) {
        log.info("start get bookings");
        Specification<Booking> sortable = RSQLJPASupport.toSort(sort);
        Specification<Booking> filterable = RSQLJPASupport.toSpecification(filter);
        Specification<Booking> searchable = SearchHelper.buildSearchSpec(searchField, searchValue, SEARCH_FIELDS);
        Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
        return repository.findAll(
                sortable
                        .and(filterable)
                        .and(searchable),
                pageable).map(mapper::toResponse);

    }

    private void validateRoomSchedule(BookingRequest request) {
        LocalDate newCheckInDate = request.getCheckInDate();
        LocalDate newCheckOutDate = request.getCheckOutDate();
        Long roomId = request.getBookingDetail().stream()
                .map(BookingDetailRequest::getRoomId)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
        if(roomId == null){
            return;
        }
        boolean hasOverlap = repository.existsOverlappingBookingsSingle(
                roomId,
                newCheckInDate,
                newCheckOutDate);
        if (hasOverlap) {
            throw new IllegalArgumentException(
                    "Room ID " + roomId + " is already booked for this time range."
            );
        }
    }

    private void validateBookingTime(BookingRequest request){

        LocalDate checkInDate = request.getCheckInDate();
        LocalDate checkOutDate = request.getCheckOutDate();
        LocalTime  checkInTime = request.getCheckInTime();
        LocalTime checkOutTime = request.getCheckOutTime();
        BookingPackage pkg = BookingPackage.getBookingPackage(request.getBookingPackage());

        long days = ChronoUnit.DAYS.between(checkInDate, checkOutDate);
        switch (pkg){
            case FIRST_2_HOURS:
                if (days != 0) {
                    throw new IllegalArgumentException("2-hour booking must start and end on the same day.");
                }
                if (!checkOutTime.equals(checkInTime.plusHours(2))) {
                    throw new IllegalArgumentException("2-hour booking requires CheckOut = CheckIn + 2 hours.");
                }
                break;
            case OVERNIGHT:
                if (checkInTime.isBefore(LocalTime.of(22, 0))) {
                    throw new IllegalArgumentException("Overnight booking requires check-in at or after 22:00.");
                }

                if (days != 1) {
                    throw new IllegalArgumentException("Overnight booking requires check-out exactly the next day.");
                }

                // Check-out <= 12:00
                if (checkOutTime.isAfter(LocalTime.of(12, 0))) {
                    throw new IllegalArgumentException("Overnight booking requires check-out at or before 12:00.");
                }
                break;
            case FULL_DAY:
                if(checkInTime.isBefore(LocalTime.of(14,0))){
                    throw new IllegalArgumentException("Full day booking requires check-in >=14:00.");
                }
                if (days < 1) {
                    throw new IllegalArgumentException("Full day booking requires check-out exactly the next day.");
                }

                if (checkOutTime.isAfter(LocalTime.of(12, 0))) {
                    throw new IllegalArgumentException("Full day booking requires Check-out <= 2:00.");
                }


        }
    }
}
