package org.a_in_hotel.be.dto.request;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetFilterRequest {
    private String keyword;   // ô search chung (q)
    private String filter;    // chuỗi RSQL

    private Integer page;
    private Integer size;
    private String sort;
}
