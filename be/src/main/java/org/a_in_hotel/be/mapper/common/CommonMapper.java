package org.a_in_hotel.be.mapper.common;

import org.a_in_hotel.be.Enum.PriceType;
import org.a_in_hotel.be.dto.request.RoomRequest;
import org.a_in_hotel.be.dto.response.ImageResponse;
import org.a_in_hotel.be.entity.*;
import org.a_in_hotel.be.repository.StaffRepository;
import org.a_in_hotel.be.service.StaffService;
import org.a_in_hotel.be.util.SecurityUtils;
import org.mapstruct.Context;
import org.mapstruct.Named;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

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
    default ImageResponse mapImage(Image image) {
        if (image == null) return null;
        return new ImageResponse(image.getUrl(), image.getAltText());
    }
}
