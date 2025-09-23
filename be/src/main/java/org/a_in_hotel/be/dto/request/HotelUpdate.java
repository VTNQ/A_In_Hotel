package org.a_in_hotel.be.dto.request;

import lombok.Data;
import org.a_in_hotel.be.Enum.HotelStatus;

@Data
public class HotelUpdate {
    private String name;
    private Long id;
    private String address;
    private Long idUser;
    private HotelStatus status;
}
