package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.RewardTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RewardTransactionRepository extends JpaRepository<RewardTransaction,Long>,
        JpaSpecificationExecutor<RewardTransaction> {
    @Query(" select coalesce(sum(abs(rt.points)), 0)\n" +
            "    from RewardTransaction rt\n" +
            "    where rt.customerId = :customerId\n" +
            "      and rt.points < 0")
    Integer sumUsedPointsByCustomer(@Param("customerId") Long customerId);
}
