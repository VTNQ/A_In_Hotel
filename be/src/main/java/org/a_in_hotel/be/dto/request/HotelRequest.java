package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class HotelRequest {
    @NotBlank(message = "Hotel name is required / Tên khách sạn không được để trống")
    private String name;
    @NotBlank(message = "Hotel address is required / Địa chỉ khách sạn không được để trống")
    private String address;
    @NotNull(message = "Manager is required / Phải chọn người quản lý cho khách sạn")
    private Long idUser;

    List<HotelHotlineRequest> hotlines;
}
