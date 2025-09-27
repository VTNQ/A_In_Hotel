package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long>, JpaSpecificationExecutor<Account> {
    Optional<Account> findByEmail(String email);
    Page<Account>findByRoleId(Long roleId,Specification<Account> spec, Pageable pageable);
}
