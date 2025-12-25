package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.Enum.BookingPackage;
import org.a_in_hotel.be.Enum.BookingStatus;
import org.a_in_hotel.be.Enum.PaymentType;
import org.a_in_hotel.be.Enum.RoomStatus;
import org.a_in_hotel.be.dto.request.*;
import org.a_in_hotel.be.dto.response.BookingResponse;
import org.a_in_hotel.be.entity.*;
import org.a_in_hotel.be.mapper.BookingDetailMapper;
import org.a_in_hotel.be.mapper.BookingMapper;
import org.a_in_hotel.be.mapper.CheckOutExtraMapper;
import org.a_in_hotel.be.mapper.PaymentMapper;
import org.a_in_hotel.be.repository.BookingRepository;
import org.a_in_hotel.be.repository.ExtraServiceRepository;
import org.a_in_hotel.be.repository.PaymentRepository;
import org.a_in_hotel.be.repository.RoomRepository;
import org.a_in_hotel.be.service.BookingService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository repository;

    private final BookingMapper mapper;

    private final BookingDetailMapper detailMapper;

    private final RoomRepository roomRepository;

    private final CheckOutExtraMapper checkOutExtraMapper;

    private final ExtraServiceRepository extraServiceRepository;

    private final PaymentRepository paymentRepository;

    private final PaymentMapper paymentMapper;

    private final SecurityUtils securityUtils;

    private static final List<String> SEARCH_FIELDS = List.of("code", "phoneNumber");

    @Override
    public void create(BookingRequest request) {

        validateBookingTime(request);

        validateRoomAvailable(request);
        validateRoomSchedule(request);
        Booking booking = mapper.toEntity
                (request, detailMapper, roomRepository, extraServiceRepository, securityUtils.getCurrentUserId());
        Payment payment = paymentMapper.toEntity(request);
        payment.setBooking(booking);
        booking.setPayment(payment);
        repository.save(booking);
        log.info("Booking created {} details",
                booking.getDetails() != null ? booking.getDetails().size() : 0);
    }

    private void validateRoomAvailable(BookingRequest request) {
        List<Long> roomIds = request.getBookingDetail().stream()
                .map(BookingDetailRequest::getRoomId)
                .filter(Objects::nonNull)
                .toList();

        if (roomIds.isEmpty()) {
            return;
        }

        roomIds.forEach(roomId -> {
            var room = roomRepository.findById(roomId)
                    .orElseThrow(() ->
                            new IllegalArgumentException("Room ID " + roomId + " not found")
                    );

            if (room.getStatus() != RoomStatus.AVAILABLE.getCode()) {
                throw new IllegalArgumentException(
                        "Room ID " + roomId + " is not available"
                );
            }
        });
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

    @Override
    public BookingResponse findById(Long id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(()->new EntityNotFoundException("Booking Not found"));
    }

    @Override
    @Transactional
    public void confirmCheckIn(Long bookingId) {

        Booking booking = repository.getReferenceById(bookingId);

        if (!booking.getStatus().equals(BookingStatus.BOOKED.getCode())) {
            throw new IllegalStateException("Only BOOKED booking can be checked-in");
        }

        booking.setStatus(BookingStatus.CHECKIN.getCode());
        booking.setCheckedInAt(OffsetDateTime.now());
        booking.setUpdatedBy(securityUtils.getCurrentUserId().toString());

        booking.getDetails().forEach(detail -> {
            if (detail.getRoom() != null) {
                detail.getRoom().setStatus(RoomStatus.OCCUPIED.getCode());
            }
        });

        repository.save(booking);
    }

    @Override
    @Transactional
    public void confirmCheckOut(Long bookingId, CheckOutRequest request) {

        Booking booking = getBookingWithAllowedStatuses(bookingId, BookingStatus.CHECKIN.getCode());

        addExtraCharges(booking, request);

        updateTotalPriceWithExtras(booking);

        recordPayment(booking, request.getPaidAmount());

        booking.setStatus(BookingStatus.CHECKOUT.getCode());
        booking.setCheckedOutAt(OffsetDateTime.now());
        booking.setUpdatedBy(securityUtils.getCurrentUserId().toString());

        releaseRooms(booking);

        repository.save(booking);
    }

    @Override
    @Transactional
    public void switchRoom(Long bookingId, SwitchRoomRequest request) {

        Booking booking = getBookingWithAllowedStatuses(
                bookingId,
                BookingStatus.CHECKIN.getCode()
        );

        validateSwitchRoomItems(booking,request.getItems());

        OffsetDateTime now = OffsetDateTime.now();

        for (RoomSwitchItem item : request.getItems()){
            switchSingleRoom(booking,item,request.getReason(),now);
        }

        repository.save(booking);
    }

    private void validateSwitchRoomItems(
            Booking booking,
            List<RoomSwitchItem> items
    ){
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("No rooms to switch");
        }

        Set<Long> newRoomIds = new HashSet<>();
        for (RoomSwitchItem item : items) {
            if (!newRoomIds.add(item.getNewRoomId())) {
                throw new IllegalStateException("Duplicate new room in switch request");
            }
        }

        Set<Long> detailIds = new HashSet<>();
        for (RoomSwitchItem item : items) {
            if (!detailIds.add(item.getBookingDetailId())) {
                throw new IllegalStateException("Duplicate booking detail in switch request");
            }
        }

    }
    private BigDecimal resolveRoomPrice(
            Room room,
            Booking booking
    ) {
        BookingPackage bookingPackage =
                BookingPackage.getBookingPackage(booking.getBookingPackage());

        return switch (bookingPackage) {
            case FIRST_2_HOURS -> room.getBasePrice();
            case FULL_DAY -> room.getDefaultRate();
            case OVERNIGHT -> room.getOvernightPrice();
        };
    }

    private void switchSingleRoom(
            Booking booking,
            RoomSwitchItem item,
            String reason,
            OffsetDateTime now
    ){
        BookingDetail currentDetail = getActiveRoomDetail(
                booking,
                item.getBookingDetailId()
        );

        Room newRoom = roomRepository.findById(item.getNewRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        if (!newRoom.getStatus().equals(RoomStatus.AVAILABLE.getCode())) {
            throw new IllegalStateException("Room " + newRoom.getRoomName() + " is not available");
        }

        currentDetail.setEndAt(now);
        currentDetail.setActive(false);
        currentDetail.setUpdatedBy(securityUtils.getCurrentUserId().toString());

        Room oldRoom = currentDetail.getRoom();

        BookingDetail newDetail = new BookingDetail();
        newDetail.setBooking(booking);
        newDetail.setRoom(newRoom);
        newDetail.setRoomName(newRoom.getRoomName());
        newDetail.setRoomType(newRoom.getRoomType().getName());
        newDetail.setRoomType(newRoom.getRoomType().getName());
        newDetail.setPrice(resolveRoomPrice(newRoom,booking));
        newDetail.setActive(true);
        newDetail.setStartAt(now);
        newDetail.setEndAt(null);
        newDetail.setCreatedBy(securityUtils.getCurrentUserId().toString());

        oldRoom.setStatus(RoomStatus.AVAILABLE.getCode());
        newRoom.setStatus(RoomStatus.OCCUPIED.getCode());

        booking.getDetails().add(newDetail);

        handleRoomSwitchSurcharge(
                booking,
                currentDetail.getPrice(),
                newDetail.getPrice(),
                item.getExtraServiceId(),
                reason
        );
    }

    private void handleRoomSwitchSurcharge(
            Booking booking,
            BigDecimal oldPrice,
            BigDecimal newPrice,
            Long extraServiceId,
            String reason
    ) {
        // 1. Không upgrade → không phụ thu
        BigDecimal diff = newPrice.subtract(oldPrice);
        if (diff.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        // 2. Không chọn service → bỏ qua
        if (extraServiceId == null) {
            return;
        }

        // 3. Load extra service từ DB
        ExtraService service = extraServiceRepository.findById(extraServiceId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Extra service not found")
                );

        if (!Boolean.TRUE.equals(service.getIsActive())) {
            throw new IllegalStateException("Extra service is inactive");
        }

        if (!service.getExtraCharge().equals(1)) {
            throw new IllegalStateException("Service is not an extra charge");
        }

        // 4. Xác định giá phụ thu
        BigDecimal surchargePrice =
                service.getPrice().compareTo(BigDecimal.ZERO) > 0
                        ? service.getPrice()
                        : diff;

        // 5. Ghi booking detail
        BookingDetail extra = new BookingDetail();
        extra.setBooking(booking);
        extra.setExtraService(service);
        extra.setExtraServiceName(service.getServiceName());

        extra.setPrice(surchargePrice);

        extra.setSpecialRequest(reason);
        extra.setCreatedBy(securityUtils.getCurrentUserId().toString());

        booking.getDetails().add(extra);

        // 6. Update total price
        booking.setTotalPrice(
                booking.getTotalPrice().add(surchargePrice)
        );
    }


    private BookingDetail getActiveRoomDetail(
            Booking booking,
            Long bookingDetailId
    ) {
        return booking.getDetails().stream()
                .filter(d ->
                        d.getId().equals(bookingDetailId)
                                && d.getRoom() != null
                                && d.getEndAt() == null
                )
                .findFirst()
                .orElseThrow(() ->
                        new IllegalStateException("Active room not found")
                );
    }
    private void validateRoomSchedule(BookingRequest request) {
        LocalDate newCheckInDate = request.getCheckInDate();
        LocalDate newCheckOutDate = request.getCheckOutDate();
        Long roomId = request.getBookingDetail().stream()
                .map(BookingDetailRequest::getRoomId)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
        if (roomId == null) {
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

    private void validateBookingTime(BookingRequest request) {

        LocalDate checkInDate = request.getCheckInDate();
        LocalDate checkOutDate = request.getCheckOutDate();
        LocalTime checkInTime = request.getCheckInTime();
        LocalTime checkOutTime = request.getCheckOutTime();
        BookingPackage pkg = BookingPackage.getBookingPackage(request.getBookingPackage());

        long days = ChronoUnit.DAYS.between(checkInDate, checkOutDate);
        switch (pkg) {
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
                if (checkInTime.isBefore(LocalTime.of(14, 0))) {
                    throw new IllegalArgumentException("Full day booking requires check-in >=14:00.");
                }
                if (days < 1) {
                    throw new IllegalArgumentException("Full day booking requires check-out exactly the next day.");
                }

                if (checkOutTime.isAfter(LocalTime.of(12, 0))) {
                    throw new IllegalArgumentException("Full day booking requires Check-out <= 12:00.");
                }


        }
    }

    private Booking getBookingWithAllowedStatuses(
            Long bookingId,
            Integer status) {

        Booking booking = repository.getReferenceById(bookingId);

        if (!booking.getStatus().equals(BookingStatus.fromCode(status).getCode())) {
            throw new IllegalStateException("Invalid booking status. Allowed:" + BookingStatus.fromCode(status));
        }
        return booking;
    }

    private void addExtraCharges(Booking booking, CheckOutRequest request) {
        if (request.getExtraCharges() == null || request.getExtraCharges().isEmpty()) {
            return;
        }

        request.getExtraCharges().forEach(ec -> {
            BookingDetail detail = checkOutExtraMapper.toEntity(
                    ec,
                    extraServiceRepository,
                    securityUtils.getCurrentUserId()
            );
            detail.setBooking(booking);
            booking.getDetails().add(detail);
        });
    }

    private BigDecimal calculateExtraTotal(Booking booking) {
        return booking.getDetails().stream()
                .filter(d -> d.getExtraService().getId() != null)
                .map(BookingDetail::getPrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }


    private void updateTotalPriceWithExtras(Booking booking) {
        BigDecimal extraTotal = calculateExtraTotal(booking);
        booking.setTotalPrice(booking.getTotalPrice().add(extraTotal));
    }

    private PaymentType resolveCheckoutPaymentType(
            BigDecimal paidAmount,
            BigDecimal outstanding
    ) {
        if (paidAmount.compareTo(outstanding) >= 0) {
            return PaymentType.FULL;
        }

        return PaymentType.PARTIAL;
    }

    private void recordPayment(
            Booking booking,
            BigDecimal paidAmount
    ) {
        if (paidAmount == null || paidAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        BigDecimal outStanding = calculateExtraTotal(booking);
        PaymentType type = resolveCheckoutPaymentType(paidAmount, outStanding);

        Payment payment = paymentMapper.toEntity(
                paidAmount,
                type,
                booking
        );

        payment.setPaymentMethod("OCD");

        paymentRepository.save(payment);
    }

    private void releaseRooms(Booking booking) {
        booking.getDetails().forEach(d -> {
            if (d.getRoom() != null) {
                d.getRoom().setStatus(RoomStatus.AVAILABLE.getCode());
            }
        });
    }
}
