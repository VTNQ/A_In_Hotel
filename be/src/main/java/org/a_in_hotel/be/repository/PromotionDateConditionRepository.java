package org.a_in_hotel.be.repository;

import lombok.Data;
import org.a_in_hotel.be.entity.PromotionDateCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionDateConditionRepository extends JpaRepository<PromotionDateCondition,Long>,
        JpaSpecificationExecutor<PromotionDateCondition> {
}
