package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.CustomerStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerStatsRepository extends JpaRepository<CustomerStats, Long> {
    List<CustomerStats> findByCustomerIdIn(List<Long> customerIds);
}
