package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Franchise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FranchiseRepository extends JpaRepository<Franchise,Long> {
    Optional<Franchise> findFirstBy();
}
