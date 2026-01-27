package org.a_in_hotel.be.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "voucher")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Voucher {
    @Id
    @Column(name = "id", length = 10)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "voucher_code")
    private String voucherCode;
    @Column(name = "voucher_Name")
    private String voucherName;
    @Column(name = "type")
    private Integer type;
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    @Column(name = "value")
    private BigDecimal value;
    @Column(name = "max_discount_value")
    private BigDecimal maxDiscountValue;
    @Column(name = "booking_type")
    private Integer bookingType;

    @Column(name = "min_nights")
    private Integer minimumStay;

    private Integer customerType;

    private Integer usageType;

    @Column(name = "usage_limit")
    private Integer usageLimit; // chỉ dùng khi MULTI_USE

    @Column(name = "usage_per_customer")
    private Integer usagePerCustomer;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "stack_with_promotion")
    private Boolean stackWithPromotion;
    @Column(name = "stack_with_voucher")
    private Boolean stackWithOtherVoucher;
    @Column(name = "priority", nullable = false)
    private Integer priority;
    @Column(name = "is_active")
    private Boolean isActive = true;

    @OneToMany(mappedBy = "voucher", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<VoucherRoomType>roomTypes = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX") // XXX = +07:00
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    private OffsetDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;
}
