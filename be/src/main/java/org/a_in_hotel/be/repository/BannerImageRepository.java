package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.BannerImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BannerImageRepository extends JpaRepository<BannerImage,Long>, JpaSpecificationExecutor<BannerImage> {
}
