package com.example.hotelservice.dto.request;

import com.example.hotelservice.Enum.HotelStatus;
import lombok.Data;

@Data
public class HotelUpdate {
    private String name;
    private Long id;
    private String address;
    private Long idUser;
    private HotelStatus status;
}
