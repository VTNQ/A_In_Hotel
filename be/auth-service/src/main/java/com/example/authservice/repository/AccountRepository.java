package com.example.authservice.repository;

import com.example.authservice.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface AccountRepository extends JpaRepository<Account,Long>, JpaSpecificationExecutor<Account> {
    Optional<Account>findByEmail(String email);
    @Query("SELECT a FROM Account a JOIN a.role r WHERE r.name = 'ADMIN'")
    List<Account> findAllAdmins();
    List<Account> findByRole_Name(String roleName);
}
