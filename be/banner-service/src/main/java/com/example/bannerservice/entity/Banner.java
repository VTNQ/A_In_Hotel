package com.example.bannerservice.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @Comment("NULL = bắt đầu ngay")
    @Column(name = "start_at")
    private Instant startAt;

    @Comment("NULL = không hết hạn")
    @Column(name = "end_at")
    private Instant endAt;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "image_id", referencedColumnName = "id") // FK tới BannerImage
    private BannerImage image;
    @Comment("Nút CTA, ví dụ: Mua ngay. Có thể null")
    @Column(name = "cta_label", columnDefinition = "TEXT")
    private String ctaLabel;

    @Comment("Mô tả ngắn gọn cho banner")
    @Column(columnDefinition = "TEXT")
    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
 
}
