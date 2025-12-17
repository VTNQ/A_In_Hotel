package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssetResponseOfHotel {

    private String assetName;
    private ImageResponse thumbnail;
}
