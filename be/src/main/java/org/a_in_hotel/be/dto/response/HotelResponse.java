package org.a_in_hotel.be.dto.response;

import lombok.Data;
import org.a_in_hotel.be.Enum.HotelStatus;

import java.util.List;

@Data
public class HotelResponse {
    private Long id;
    private String name;
    private String code;
    private String address;
    private String fullName;
    private Long createdAt;
    private Long idUser;
    private Integer status;
    private ImageResponse thumbnail;
    private List<HotelHotlineResponse> hotlines;
}
