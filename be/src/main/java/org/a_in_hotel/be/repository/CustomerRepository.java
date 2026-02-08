package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Long>,
        JpaSpecificationExecutor<Customer> {
    @Query("select a from  Customer a where a.account.email = :email")
    Optional<Customer> findByEmail(String email);


}
