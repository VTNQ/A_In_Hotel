package com.example.bannerservice.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "banner",
        indexes = {
                @Index(name = "idx_banner_active_time", columnList = "start_at,end_at,priority")
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

    @Column(nullable = false)
    @ColumnDefault("100")
    private Integer priority = 100;
    @OneToMany(mappedBy = "banner", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<BannerImage> images = new ArrayList<>();
    @Comment("Nút CTA, ví dụ: 'Mua ngay'. Có thể null")
    @Column(name = "cta_label", columnDefinition = "TEXT")
    private String ctaLabel;

    @Comment("Mô tả ngắn gọn cho banner")
    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToMany
    @JoinTable(
            name = "banner_category",
            joinColumns = @JoinColumn(name = "banner_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    private Instant updatedAt = Instant.now();

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }
}
