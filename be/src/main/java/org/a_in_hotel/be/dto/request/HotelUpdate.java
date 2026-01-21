package org.a_in_hotel.be.dto.request;

import lombok.Data;
import org.a_in_hotel.be.Enum.HotelStatus;
import org.a_in_hotel.be.entity.HotelHotline;

import java.util.List;

@Data
public class HotelUpdate {
    private String name;
    private Long id;
    private String address;
    private Long idUser;
    private Integer status;
    private List<HotelHotlineRequest> hotlines;
}
