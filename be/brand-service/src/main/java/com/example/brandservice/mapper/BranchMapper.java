package com.example.brandservice.mapper;

import com.example.brandservice.dto.request.BranchRequest;
import com.example.brandservice.entity.Branch;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.Instant;
import java.util.UUID;

@Mapper(
        componentModel = "spring",
        imports = {Instant.class, UUID.class},
        builder = @org.mapstruct.Builder(disableBuilder = true) // ⭐ TẮT builder
)
public interface BranchMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "ACTIVE")
    @Mapping(target = "code", expression = "java(com.example.brandservice.mapper.BranchMapper.generateBranchCode())")
    Branch toEntity(BranchRequest branch);

    static String generateBranchCode() {
        String prefix = "HCM";
        return prefix + "-" + UUID.randomUUID().toString();
    }
}
