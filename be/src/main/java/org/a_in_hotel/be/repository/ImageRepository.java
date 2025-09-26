package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ImageRepository extends JpaRepository<Image,Long>, JpaSpecificationExecutor<Image> {
}
