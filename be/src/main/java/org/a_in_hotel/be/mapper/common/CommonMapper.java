package org.a_in_hotel.be.mapper.common;

import org.a_in_hotel.be.Enum.PriceType;
import org.a_in_hotel.be.dto.request.RoomRequest;
import org.a_in_hotel.be.dto.response.ImageRoomResponse;
import org.a_in_hotel.be.entity.*;
import org.a_in_hotel.be.util.SecurityUtils;
import org.mapstruct.Named;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public interface CommonMapper {
    default Set<Tag> mapTagNames(List<String> tagNames) {
        if (tagNames == null) return null;
        return tagNames.stream()
                .filter(name -> name != null && !name.isBlank())
                .map(name -> {
                    Tag tag = new Tag();
                    tag.setName(name.trim());
                    return tag;
                })
                .collect(Collectors.toSet());
    }

    @Named("mapUserIdToAccount")
    default Account mapUserIdToAccount(Long IdUser) {
        if (IdUser == null) return null;
        Account acc = new Account();
        acc.setId(IdUser);
        return acc;
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

    default Set<String> mapTagsToNames(Set<Tag> tags) {
        if (tags == null) return null;
        return tags.stream()
                .map(Tag::getName)
                .collect(Collectors.toSet());
    }

    default List<String> mapImagesToUrls(Blog blog) {
        if (blog == null || blog.getImage() == null) return List.of();
        return List.of(blog.getImage().getUrl());
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
    default Hotel mapHotelFromToken(SecurityUtils securityUtils) {
        Long hotelId = securityUtils.getHotelId();
        Hotel hotel = new Hotel();
        hotel.setId(hotelId);
        return hotel;
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

    default List<ImageRoomResponse> mapImages(List<Image> images) {
        if (images == null || images.isEmpty()) return List.of();
        return images.stream()
                .filter(img -> "Room".equalsIgnoreCase(img.getEntityType()))
                .map(img -> new ImageRoomResponse(img.getUrl(), img.getAltText()))
                .toList();
    }


    default BigDecimal getBigDecimalPrice(Room room, PriceType type, String field) {
        if (room.getRoomPriceOptions() == null) return null;
        return room.getRoomPriceOptions().stream()
                .filter(otp -> otp.getPriceType() == type)
                .findFirst()
                .map(opt -> switch (field) {
                    case "basePrice" -> opt.getBasePrice();
                    case "additionalPrice" -> opt.getAdditionalPrice();
                    default -> null;
                })
                .orElse(null);
    }

    default Integer getIntegerPrice(Room room, PriceType type, String field) {
        if (room.getRoomPriceOptions() == null) return null;
        return room.getRoomPriceOptions().stream()
                .filter(otp -> otp.getPriceType() == type)
                .findFirst()
                .map(opt -> switch (field) {
                    case "baseDurationHours" -> opt.getBaseDurationHours();
                    default -> null;
                })
                .orElse(null);
    }

    default List<RoomPriceOption> mapPriceOptions(RoomRequest request, Room room, Long userId) {
        List<RoomPriceOption> options = new ArrayList<>();
        if (request.getHourlyBasePrice() != null) {
            RoomPriceOption hourlyOption = new RoomPriceOption();
            hourlyOption.setRoom(room);
            hourlyOption.setPriceType(PriceType.HOURLY);
            hourlyOption.setBasePrice(request.getHourlyBasePrice());
            hourlyOption.setBaseDurationHours(2);
            hourlyOption.setAdditionalPrice(request.getHourlyAdditionalPrice());
            hourlyOption.setCreatedBy(String.valueOf(userId));
            hourlyOption.setUpdatedBy(String.valueOf(userId));
            options.add(hourlyOption);
        }
        if (request.getOvernightPrice() != null) {
            RoomPriceOption overnightOption = new RoomPriceOption();
            overnightOption.setRoom(room);
            overnightOption.setPriceType(PriceType.OVERNIGHT);
            overnightOption.setBasePrice(request.getOvernightPrice());
            overnightOption.setCreatedBy(String.valueOf(userId));
            overnightOption.setUpdatedBy(String.valueOf(userId));
            options.add(overnightOption);
        }
        return options;
    }

    default void updateRoomPriceOptions(RoomRequest request, Room room, Long userId) {
        if (room.getRoomPriceOptions() == null) {
            room.setRoomPriceOptions(new ArrayList<>());
        }
        List<RoomPriceOption> existingOptions = room.getRoomPriceOptions();
        List<RoomPriceOption> updatedList = new ArrayList<>();
        if (request.getHourlyBasePrice() != null) {
            RoomPriceOption hourly = findOptionByType(existingOptions, PriceType.HOURLY);
            if (hourly == null) {
                hourly = new RoomPriceOption();
                hourly.setRoom(room);
                hourly.setPriceType(PriceType.HOURLY);
                hourly.setCreatedBy(String.valueOf(userId));
            }
            hourly.setBasePrice(request.getHourlyBasePrice());
            hourly.setBaseDurationHours(2);
            hourly.setAdditionalPrice(request.getHourlyAdditionalPrice());
            hourly.setUpdatedBy(String.valueOf(userId));
            updatedList.add(hourly);
        }
        if (request.getOvernightPrice() != null) {
            RoomPriceOption overnight = findOptionByType(existingOptions, PriceType.OVERNIGHT);
            if (overnight == null) {
                overnight = new RoomPriceOption();
                overnight.setRoom(room);
                overnight.setPriceType(PriceType.OVERNIGHT);
                overnight.setCreatedBy(String.valueOf(userId));
            }
            overnight.setBasePrice(request.getOvernightPrice());
            overnight.setUpdatedBy(String.valueOf(userId));
            updatedList.add(overnight);
        }
        List<PriceType> requestedTypes = updatedList.stream()
                .map(RoomPriceOption::getPriceType)
                .toList();
        existingOptions.removeIf(option -> !requestedTypes.contains(option.getPriceType()));
        room.getRoomPriceOptions().clear();
        room.getRoomPriceOptions().addAll(updatedList);
    }

    default RoomPriceOption findOptionByType(List<RoomPriceOption> options, PriceType typeCode) {
        if (options == null) return null;
        for (RoomPriceOption option : options) {
            if (option.getPriceType() == typeCode) {
                return option;
            }
        }
        return null;
    }
}
