package com.example.hotelservice.dto.request;

import lombok.Data;

@Data
public class HotelRequest {
    private String name;
    private Long id;
    private String code;
    private String address;
    private Long idUser;
}
