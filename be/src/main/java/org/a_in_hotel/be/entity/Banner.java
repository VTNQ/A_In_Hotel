package org.a_in_hotel.be.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Entity
@Table(
        name = "`banner`",
        indexes = {
                @Index(name = "idx_banner_active_time", columnList = "start_at,end_at")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "start_at")
    private OffsetDateTime startAt;

    @Column(name = "end_at")
    private OffsetDateTime endAt;

    @Column(name = "banner_code", nullable = false, unique = true, length = 20)
    private String bannerCode;

    @Transient
    private Image image;
    @Comment("Nút CTA, ví dụ: Mua ngay. Có thể null")
    @Column(name = "cta_label", columnDefinition = "TEXT")
    private String ctaLabel;

    @Comment("Mô tả ngắn gọn cho banner")
    @Column(columnDefinition = "TEXT")
    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    @Column(nullable = false)
    private OffsetDateTime updatedAt;
    @Column(name = "created_by")
    private String createdBy;
    @Column(name = "updated_by")
    private String updatedBy;

    @PrePersist
    public void prePersist() {
        if (this.bannerCode == null || this.bannerCode.isEmpty()) {
            this.bannerCode = "BN" + String.format("%04d", (int) (Math.random() * 9999));
        }
    }


}
