package org.a_in_hotel.be.mapper.common;

import org.a_in_hotel.be.Enum.BookingPackage;
import org.a_in_hotel.be.Enum.PriceType;
import org.a_in_hotel.be.dto.request.BookingDetailRequest;
import org.a_in_hotel.be.dto.request.RoomRequest;
import org.a_in_hotel.be.dto.response.ImageResponse;
import org.a_in_hotel.be.entity.*;
import org.a_in_hotel.be.mapper.BookingDetailMapper;
import org.a_in_hotel.be.repository.ExtraServiceRepository;
import org.a_in_hotel.be.repository.ImageRepository;
import org.a_in_hotel.be.repository.RoomRepository;
import org.a_in_hotel.be.repository.StaffRepository;
import org.a_in_hotel.be.service.StaffService;
import org.a_in_hotel.be.util.SecurityUtils;
import org.mapstruct.Context;
import org.mapstruct.Named;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public interface CommonMapper {
    @Named("capitalizeFirstLetter")
    default String capitalizeFirstLetter(String value) {
        if (value == null || value.isEmpty()) return value;
        value = value.toLowerCase(); // đưa hết về thường trước
        return value.substring(0, 1).toUpperCase() + value.substring(1);

    }

    @Named("mapUserIdToAccount")
    default Account mapUserIdToAccount(Long IdUser) {
        if (IdUser == null) return null;
        Account acc = new Account();
        acc.setId(IdUser);
        return acc;
    }
    @Named("mapAccountIdToFullName")
    default String mapAccountIdToFullName(Long idAccount, @Context StaffRepository staffRepository) {
        if(idAccount == null) return null;
        return staffRepository.findByAccountId(idAccount)
                .map(Staff::getFullName)
                .orElse(null);
    }
    @Named("mapRoleFromId")
    default Role mapRoleFromId(Long idRole) {
        if (idRole == null) return null;
        Role role = new Role();
        role.setId(idRole);
        return role;
    }

    @Named("instantToLong")
    static Long instantToLong(Instant instant) {
        return instant != null ? instant.toEpochMilli() : null;
    }

    @Named("mapCategory")
    default Category mapCategory(Long id) {
        if (id == null) return null;
        Category c = new Category();
        c.setId(id);
        return c;
    }
    @Named("mapRoom")
    default Room mapRoom(Long id) {
        if (id == null) return null;
        Room r = new Room();
        r.setId(id);
        return r;
    }
    @Named("mapHotel")
    default Hotel mapHotel(Long id) {
        if (id == null) return null;
        Hotel r = new Hotel();
        r.setId(id);
        return r;
    }

    @Named("mapRoomTypeFromId")
    default Category mapRoomTypeFromId(Long idRoomType) {
        if (idRoomType == null) return null;
        Category roomType = new Category();
        roomType.setId(idRoomType);
        return roomType;
    }

    @Named("mapCategoryFromId")
    default Category mapCategoryFromId(Long idCategory) {
        if (idCategory == null) return null;
        Category category = new Category();
        category.setId(idCategory);
        return category;
    }
    default String resolveCreatedBy(String createdBy, StaffService accountService) {
        if (createdBy == null) return null;

        try {
            Long id = Long.parseLong(createdBy);
            var account = accountService.findByAccountId(id);
            if (account != null && account.getFullName() != null) {
                return account.getFullName();
            }
        } catch (Exception ignored) {
            // Nếu parse fail hoặc không tìm thấy user → bỏ qua
        }

        // fallback
        return createdBy;
    }

    default List<ImageResponse>  mapImages(List<Image> images) {
        if (images == null || images.isEmpty()) return List.of();
        return images.stream()
                .filter(img -> "Room".equalsIgnoreCase(img.getEntityType()))
                .map(img -> new ImageResponse(img.getUrl(), img.getAltText()))
                .toList();
    }
    default ImageResponse mapImageV2(
            Long entityId,
            String entityType,
            ImageRepository imageRepository) {
        return imageRepository
                .findFirstByEntityIdAndEntityType(entityId,entityType)
                .map(img->new ImageResponse(img.getUrl(),img.getAltText()))
                .orElse(null);


    }
    default ImageResponse mapImage(Image image) {
        if (image == null) return null;
        return new ImageResponse(image.getUrl(), image.getAltText());
    }

    @Named("mapDetails")
    default List<BookingDetail> mapDetails(
            List<BookingDetailRequest> requests,
            Booking booking,
            @Context BookingDetailMapper detailMapper,
            @Context RoomRepository roomRepository,
            @Context ExtraServiceRepository extraServiceRepository,
            Long userId) {
        List<BookingDetail> details = requests.stream()
                .map(req -> {
                    BookingDetail detail = detailMapper.toEntity
                            (req,roomRepository,extraServiceRepository,userId);
                    detail.setBooking(booking);
                    validatePrice(
                            detail,
                            req.getPrice(),
                            booking,roomRepository,extraServiceRepository);
                    detail.setPrice(req.getPrice());
                    return detail;
                })
                .collect(Collectors.toList());
        BigDecimal systemTotal = calculateTotalPrice(details);

        validateTotalPrice(booking.getTotalPrice(), systemTotal);

        return details;
    }

    default void  validatePrice(BookingDetail detail,
                                BigDecimal fePrice,
                                Booking booking,
                                @Context RoomRepository roomRepository,
                                @Context ExtraServiceRepository extraServiceRepository
                                ) {

        BigDecimal systemPrice = calculateCorrectPrice(
                detail,
                booking,
                roomRepository,
                extraServiceRepository);

        if (fePrice == null)
            throw new IllegalArgumentException("Price is required.");
        if(systemPrice.compareTo(fePrice) !=0){
            throw new IllegalArgumentException(
                    "Invalid price for detail. Expected: " + systemPrice + ", received: " + fePrice
            );
        }
    }

    default BigDecimal calculateCorrectPrice(
            BookingDetail detail,
            Booking booking,
            @Context RoomRepository roomRepository,
            @Context ExtraServiceRepository extraServiceRepository
            ) {
        if(detail.getExtraService() != null) {
            ExtraService extraService = extraServiceRepository.
                    getReferenceById(detail.getExtraService().getId());
            return extraService.getPrice().multiply(BigDecimal.valueOf(detail.getQuantity()));
        }

        if(detail.getRoom()!=null){
            Room room = roomRepository.
                    getReferenceById(detail.getRoom().getId());
            BookingPackage bookingPackage = BookingPackage.
                    getBookingPackage(booking.getBookingPackage());

            long days = ChronoUnit.DAYS.between(
                    booking.getCheckInDate(),
                    booking.getCheckOutDate());

            if(days <=0) days = 1;
            return switch (bookingPackage) {
                case FIRST_2_HOURS -> room.getBasePrice();         // 2 giờ
                case OVERNIGHT -> room.getOvernightPrice();    // Qua đêm
                case FULL_DAY -> room.getDefaultRate()
                        .multiply(BigDecimal.valueOf(days));       // Full day
                default -> throw new IllegalArgumentException("Unknown bookingPackage");
            };
        }
        throw new IllegalStateException("BookingDetail must have room or extraService.");
    }
    default void validateTotalPrice(BigDecimal feTotal, BigDecimal systemTotal) {

        if (feTotal == null) {
            throw new IllegalArgumentException("totalPrice is required");
        }

        if (feTotal.compareTo(systemTotal) != 0) {
            throw new IllegalArgumentException(
                    "Invalid total price. Expected: " + systemTotal + ", received: " + feTotal
            );
        }
    }


    default BigDecimal calculateTotalPrice(List<BookingDetail> details){
        return details.stream()
                .map(d->d.getPrice().multiply(BigDecimal.valueOf(d.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
