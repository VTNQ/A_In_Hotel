package com.example.bannerservice.repository;

import com.example.bannerservice.entity.BannerImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BannerImageRepository extends JpaRepository<BannerImage, Long> {
}
