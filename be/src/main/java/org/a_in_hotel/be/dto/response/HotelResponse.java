package org.a_in_hotel.be.dto.response;

import lombok.Data;
import org.a_in_hotel.be.Enum.HotelStatus;

@Data
public class HotelResponse {
    private Long id;
    private String name;
    private String code;
    private String address;
    private String fullName;
    private Long createdAt;
    private Long idUser;
    private HotelStatus status;
}
