package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.a_in_hotel.be.Enum.HotelStatus;
import org.a_in_hotel.be.entity.HotelHotline;

import java.util.List;

@Data
public class HotelUpdate {
    @NotBlank(message = "Hotel name is required / Tên khách sạn không được để trống")
    private String name;
    private Long id;
    @NotBlank(message = "Hotel address is required / Địa chỉ khách sạn không được để trống")
    private String address;
    @NotNull(message = "Manager is required / Phải chọn người quản lý cho khách sạn")
    private Long idUser;
    private Integer status;
    private List<HotelHotlineRequest> hotlines;
}
