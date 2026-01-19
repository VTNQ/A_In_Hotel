package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.PromotionBookingCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionBookingConditionRepository extends JpaRepository<PromotionBookingCondition,Long>,
        JpaSpecificationExecutor<PromotionBookingCondition> {
}
