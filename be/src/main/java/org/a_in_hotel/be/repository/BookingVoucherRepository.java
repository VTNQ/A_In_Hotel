package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.BookingVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingVoucherRepository extends JpaRepository<BookingVoucher, Long>,
        JpaSpecificationExecutor<BookingVoucher> {
}
