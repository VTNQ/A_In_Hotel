package org.a_in_hotel.be.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.a_in_hotel.be.Enum.UnitExtraService;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "extra_services")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExtraService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "service_code", nullable = false, unique = true, length = 50)
    private String serviceCode;

    @Column(name = "service_name", nullable = false, length = 255)
    private String serviceName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    @Column(name = "extra_charge", nullable = false)
    private Integer extraCharge;
    @Column(name = "price", precision = 15, scale = 2, nullable = false)
    private BigDecimal price;

    private Integer type;

    @Transient
    private Image icon;

    @Column(name = "currency", length = 10, nullable = false)
    private String currency = "VND"; // 💰 Loại tiền tệ mặc định
    @Enumerated(EnumType.STRING)
    @Column(name = "unit", length = 50, nullable = false)
    private UnitExtraService unit;
    @Column(name = "hotel_id")
    private Long hotelId;
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    private OffsetDateTime updatedAt;
    @Column(name = "note")
    private String note;


    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @PrePersist
    public void prePersist() {
        if (this.serviceCode == null || this.serviceCode.isEmpty()) {
            this.serviceCode = "S" + String.format("%04d", (int) (Math.random() * 9999));
        }
    }


}
