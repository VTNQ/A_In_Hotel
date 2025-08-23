package com.example.brandservice.mapper;

import com.example.brandservice.dto.request.HotelRequest;
import com.example.brandservice.entity.Hotel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.Instant;
import java.util.UUID;

@Mapper(
        componentModel = "spring",
        imports = {Instant.class, UUID.class},
        builder = @org.mapstruct.Builder(disableBuilder = true) // ⭐ TẮT builder
)
public interface HotelMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "ACTIVE")
    @Mapping(target = "code", expression = "java(com.example.brandservice.mapper.HotelMapper.generateBranchCode())")
    Hotel toEntity(HotelRequest branch);

    static String generateBranchCode() {
        String prefix = "HCM";
        return prefix + "-" + UUID.randomUUID().toString();
    }
}
