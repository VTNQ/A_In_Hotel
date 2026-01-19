package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion,Long>,
        JpaSpecificationExecutor<Promotion> {
}
