package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.ExtraChargeRequest;
import org.a_in_hotel.be.entity.BookingDetail;
import org.a_in_hotel.be.entity.ExtraService;
import org.a_in_hotel.be.repository.ExtraServiceRepository;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CheckOutExtraMapper {
    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "booking", ignore = true),

            @Mapping(target = "room", ignore = true),
            @Mapping(target = "roomName", ignore = true),
            @Mapping(target = "roomType", ignore = true),

            @Mapping(target = "extraService", ignore = true),
            @Mapping(target = "extraServiceName", ignore = true),

            @Mapping(target = "price", source = "req.price"),
            @Mapping(target = "quantity", source = "req.quantity"),

            @Mapping(target = "createdBy", source = "userId"),
            @Mapping(target = "updatedBy", source = "userId")
    })
    BookingDetail toEntity(
            ExtraChargeRequest req,
            @Context ExtraServiceRepository extraRepo,
            Long userId
    );

    @AfterMapping
    default void fillExtraService(
            ExtraChargeRequest req,
            @MappingTarget BookingDetail detail,
            @Context ExtraServiceRepository extraRepo
    ) {
        if (req.getExtraServiceId() != null) {
            ExtraService service = extraRepo.getReferenceById(req.getExtraServiceId());
            detail.setExtraService(service);
            detail.setExtraServiceName(service.getServiceName());
        }
    }
}
