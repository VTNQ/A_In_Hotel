package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.BookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingDetailRepository extends JpaRepository<BookingDetail,Long> {
}
