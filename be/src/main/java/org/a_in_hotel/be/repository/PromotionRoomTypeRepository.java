package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.PromotionRoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionRoomTypeRepository extends JpaRepository<PromotionRoomType,Long>,
        JpaSpecificationExecutor<PromotionRoomType> {
}
