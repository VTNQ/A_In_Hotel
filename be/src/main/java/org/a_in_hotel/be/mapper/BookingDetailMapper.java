package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.BookingDetailRequest;
import org.a_in_hotel.be.dto.response.BookingDetailResponse;
import org.a_in_hotel.be.entity.BookingDetail;
import org.a_in_hotel.be.entity.ExtraService;
import org.a_in_hotel.be.entity.Room;
import org.a_in_hotel.be.repository.ExtraServiceRepository;
import org.a_in_hotel.be.repository.RoomRepository;
import org.mapstruct.*;


@Mapper(componentModel = "spring",imports = {Room.class, ExtraService.class})
public interface BookingDetailMapper {

    @Mappings({
            @Mapping(target = "room",
                    expression = "java(request.getRoomId() != null ? Room.builder().id(request.getRoomId()).build() : null)"),
            @Mapping(target = "roomName", ignore = true),
            @Mapping(target = "extraServiceName", ignore = true),

            @Mapping(target = "extraService",
                    expression = "java(request.getExtraServiceId() != null ? ExtraService.builder().id(request.getExtraServiceId()).build() : null)"),



            @Mapping(target = "price",
                    expression = "java(request.getPrice() != null ? request.getPrice() : null)"),

            @Mapping(target = "booking", ignore = true),
            @Mapping(target = "createdBy", source = "userId"),
            @Mapping(target = "updatedBy", source = "userId")
    })
    BookingDetail toEntity(
            BookingDetailRequest request,
            @Context RoomRepository roomRepo,
            @Context ExtraServiceRepository extraRepo,
            Long userId);

    @AfterMapping
    default void fillNames(
            BookingDetailRequest req,
            @MappingTarget BookingDetail detail,
            @Context RoomRepository roomRepo,
            @Context ExtraServiceRepository extraRepo
                          ) {
        // snapshot room name
        if (req.getRoomId() != null) {
            Room room = roomRepo.getReferenceById(req.getRoomId());
            detail.setRoomName(room.getRoomName());
            detail.setActive(true);
            detail.setRoomNumber(room.getRoomNumber());
            detail.setRoomType(room.getRoomType().getName());
        }

        // snapshot extra service name
        if (req.getExtraServiceId() != null) {
            detail.setActive(true);
            ExtraService service = extraRepo.getReferenceById(req.getExtraServiceId());
            detail.setExtraServiceName(service.getServiceName());
        }
    }
    @Mapping(target = "roomId",source = "room.id")
    @Mapping(target = "extraServiceId",source = "extraService.id")
    BookingDetailResponse toResponse(BookingDetail bookingDetail);
}
