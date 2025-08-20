package com.example.brandservice.dto.request;

import lombok.Data;

@Data
public class HotelRequest {
    private String name;
    private String address;
    private Long idUser;
}
