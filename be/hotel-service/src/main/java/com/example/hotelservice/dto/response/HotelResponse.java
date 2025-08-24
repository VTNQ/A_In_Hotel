package com.example.hotelservice.dto.response;

import com.example.hotelservice.Enum.HotelStatus;
import lombok.Data;

@Data
public class HotelResponse {
    private Long Id;
    private String Name;
    private String code;
    private String address;
    private String fullName;
    private Long createdAt;
    private Long idUser;
    private HotelStatus status;
}
