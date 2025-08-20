package com.example.systemconfigservice.mapper;

import com.example.systemconfigservice.dto.request.SystemConfigRequest;
import com.example.systemconfigservice.entity.SystemConfig;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.Instant;
import java.util.UUID;

@Mapper(
        componentModel = "spring",
        imports = {Instant.class, UUID.class}
)
public interface SystemConfigMapper {
    @Mapping(source = "systemConfigType",target = "type")
    SystemConfig toEntity(SystemConfigRequest request);
    @Mapping(source = "systemConfigType", target = "type")
    SystemConfig toMapperUpdate(SystemConfigRequest request);
}
