package org.a_in_hotel.be.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.a_in_hotel.be.Enum.UnitExtraService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExtraServiceResponse {
    private Long id;
    private String serviceCode;
    private String serviceName;
    private String description;
    private String note;
    private String categoryName;
    private Integer categoryId;
    private BigDecimal price;
    private String currency;
    private UnitExtraService unit;
    private Boolean isActive;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
    private String priceType;
    private Integer extraCharge;
}
