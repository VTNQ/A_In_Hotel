package com.example.bannerservice.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Data
@Table(name = "banner_image",
        indexes = {
                @Index(name = "idx_bi_banner", columnList = "banner_id")
        })
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BannerImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false,columnDefinition = "TEXT")
    private String url;
    @Column(nullable = false,columnDefinition = "TEXT")
    private String altText;
    @Column(nullable = false)
    private Integer width;
    @Column(nullable = false)
    private Integer height;
    @Column(nullable = false)
    private String imageType;
    @Column(nullable = false)
    private Long sizeBytes;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "banner_id", nullable = false)
    @JsonBackReference
    private Banner banner;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    private Instant updatedAt = Instant.now();
    @PreUpdate void onUpdate() { updatedAt = Instant.now(); }
}
