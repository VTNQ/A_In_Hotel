package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.Enum.PriceType;
import org.a_in_hotel.be.dto.request.RoomRequest;
import org.a_in_hotel.be.dto.response.ImageRoomResponse;
import org.a_in_hotel.be.dto.response.RoomResponse;
import org.a_in_hotel.be.entity.Image;
import org.a_in_hotel.be.entity.Room;
import org.a_in_hotel.be.entity.RoomPriceOption;
import org.a_in_hotel.be.entity.RoomType;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.mapstruct.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface RoomMapper extends CommonMapper {

    // ========== CREATE ==========
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roomType", source = "request.idRoomType", qualifiedByName = "mapRoomTypeFromId")
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    @Mapping(target = "roomPriceOptions", expression = "java(mapPriceOptions(request,room,userId))")
    Room toEntity(RoomRequest request, Long userId);

    // ========== UPDATE ==========
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roomType", source = "request.idRoomType", qualifiedByName = "mapRoomTypeFromId")
    @Mapping(target = "updatedBy", source = "userId")
    void updateEntity(RoomRequest request, @MappingTarget Room entity, Long userId);
    // ========== RESPONSE ==========
    @Mapping(target = "roomTypeName", source = "roomType.name")
    @Mapping(target = "status", expression = "java(room.getStatus().name())")
    @Mapping(target = "images", expression = "java(mapImages(room.getImages()))")
    @Mapping(target = "hourlyBasePrice", expression = "java(getBigDecimalPrice(room, org.a_in_hotel.be.Enum.PriceType.HOURLY, \"basePrice\"))")
    @Mapping(target = "hourlyBaseDuration", expression = "java(getIntegerPrice(room, org.a_in_hotel.be.Enum.PriceType.HOURLY, \"baseDurationHours\"))")
    @Mapping(target = "hourlyAdditionalPrice", expression = "java(getBigDecimalPrice(room, org.a_in_hotel.be.Enum.PriceType.HOURLY, \"additionalPrice\"))")
    @Mapping(target = "overnightPrice", expression = "java(getBigDecimalPrice(room, org.a_in_hotel.be.Enum.PriceType.OVERNIGHT, \"basePrice\"))")
    RoomResponse toResponse(Room room);
    default List<RoomPriceOption>mapPriceOptions(RoomRequest request,Room room,Long userId){
        List<RoomPriceOption>options = new ArrayList<>();
        if(request.getHourlyBasePrice() !=null){
            RoomPriceOption hourlyOption = new RoomPriceOption();
            hourlyOption.setRoom(room);
            hourlyOption.setPriceType(PriceType.HOURLY);
            hourlyOption.setBasePrice(request.getHourlyBasePrice());
            hourlyOption.setBaseDurationHours(request.getHourlyBaseDuration());
            hourlyOption.setAdditionalPrice(request.getHourlyAdditionalPrice());
            hourlyOption.setCreatedBy(String.valueOf(userId));
            hourlyOption.setUpdatedBy(String.valueOf(userId));
            options.add(hourlyOption);
        }
        if(request.getOvernightPrice() != null){
            RoomPriceOption overnightOption=new RoomPriceOption();
            overnightOption.setRoom(room);
            overnightOption.setPriceType(PriceType.OVERNIGHT);
            overnightOption.setBasePrice(request.getOvernightPrice());
            overnightOption.setCreatedBy(String.valueOf(userId));
            overnightOption.setUpdatedBy(String.valueOf(userId));
            options.add(overnightOption);
        }
        return options;
    }
    default void updateRoomPriceOptions(RoomRequest request,Room room,Long userId){
        if(room.getRoomPriceOptions() == null){
            room.setRoomPriceOptions(new ArrayList<>());
        }
        List<RoomPriceOption>existingOptions = room.getRoomPriceOptions();
        List<RoomPriceOption>updatedList = new ArrayList<>();
        if (request.getHourlyBasePrice() != null) {
            RoomPriceOption hourly = findOptionByType(existingOptions, PriceType.HOURLY);
            if (hourly == null) {
                hourly = new RoomPriceOption();
                hourly.setRoom(room);
                hourly.setPriceType(PriceType.HOURLY);
                hourly.setCreatedBy(String.valueOf(userId));
            }
            hourly.setBasePrice(request.getHourlyBasePrice());
            hourly.setBaseDurationHours(request.getHourlyBaseDuration());
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
        List<PriceType>requestedTypes = updatedList.stream()
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
