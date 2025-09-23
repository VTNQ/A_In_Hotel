package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BannerRepository extends JpaRepository<Banner,Long>, JpaSpecificationExecutor<Banner> {
}
