package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface StaffRepository extends JpaRepository<Staff,Long>, JpaSpecificationExecutor<Staff> {
    Optional<Staff> findByAccountId(Long accountId);
}
