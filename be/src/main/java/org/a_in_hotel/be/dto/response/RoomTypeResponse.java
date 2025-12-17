package org.a_in_hotel.be.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoomTypeResponse {
    private String name;
    private String description;
    private ImageResponse  roomImage;
    private List<AssetResponseOfHotel> assets;
}
