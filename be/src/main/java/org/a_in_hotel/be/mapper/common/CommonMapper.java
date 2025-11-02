package org.a_in_hotel.be.mapper.common;

import org.a_in_hotel.be.Enum.PriceType;
import org.a_in_hotel.be.dto.response.ImageRoomResponse;
import org.a_in_hotel.be.entity.*;
import org.mapstruct.Named;

import java.math.BigDecimal;
import java.time.Instant;
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
    @Named("mapAssetFromId")
    default Asset mapAssetFromId(Long idAsset) {
        if (idAsset == null) return null;
        Asset asset = new Asset();
        asset.setId(idAsset);
        return asset;
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

    default List<ImageRoomResponse> mapImages(List<Image> images) {
        if (images == null) return List.of();
        return images.stream()
                .filter(img -> "Room".equalsIgnoreCase(img.getEntityType()))
                .map(img -> new ImageRoomResponse(img.getUrl(), img.getAltText()))
                .collect(Collectors.toList());
    }
    default BigDecimal getBigDecimalPrice(Room room, PriceType type, String field){
        if(room.getRoomPriceOptions() == null) return null;
        return room.getRoomPriceOptions().stream()
                .filter(otp->otp.getPriceType() == type)
                .findFirst()
                .map(opt->switch (field){
                    case "basePrice" -> opt.getBasePrice();
                    case "additionalPrice" -> opt.getAdditionalPrice();
                    default -> null;
                })
                .orElse(null);
    }
    default Integer getIntegerPrice(Room room,PriceType type,String field){
        if(room.getRoomPriceOptions() == null) return null;
        return room.getRoomPriceOptions().stream()
                .filter(otp->otp.getPriceType() == type)
                .findFirst()
                .map(opt->switch (field){
                    case "baseDurationHours" -> opt.getBaseDurationHours();
                    default -> null;
                })
                .orElse(null);
    }
}
