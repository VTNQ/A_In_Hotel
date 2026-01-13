package org.a_in_hotel.be.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.a_in_hotel.be.Enum.VoucherStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "vouchers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true,nullable = false)
    private String voucherCode;

    private String voucherName;

    private Integer discountType;

    private Double discountValue;

    private Double minBookingAmount;

    private Double maxDiscount;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer usageLimit;

    private Integer usageCount;

    private Integer status;

    @Schema(description = "Thời gian tạo", example = "2025-08-22 09:05:46.698643")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    @CreationTimestamp
    private OffsetDateTime createdAt;
    @Schema(description = "Thời gian cập nhật", example = "2025-08-22 09:05:46.698643")
    @UpdateTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    private OffsetDateTime updatedAt;
    @Column(name = "created_by")
    private String createdBy;
    @Column(name = "updated_by")
    private String updatedBy;

    @PrePersist
    public void prePersist(){
        if(this.voucherCode == null || this.voucherCode.isEmpty()){
            this.voucherCode = "VC" + String.format("%04d",(int)(Math.random() * 9999));
        }
        if(this.status == null){
            this.status = VoucherStatus.ACTIVE.getValue();
        }
    }
}
