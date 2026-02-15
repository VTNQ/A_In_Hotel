package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.BookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BookingDetailRepository extends JpaRepository<BookingDetail,Long>,
        JpaSpecificationExecutor<BookingDetail> {
}
