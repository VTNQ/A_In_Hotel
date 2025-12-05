package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking,Long>,
        JpaSpecificationExecutor<Booking> {
    @Query("""
    SELECT COUNT(b) > 0
    FROM BookingDetail d
    JOIN d.booking b
    WHERE d.room.id = :roomId
      AND b.checkInDate < :newCheckOutDate
      AND b.checkOutDate > :newCheckInDate
""")
    boolean existsOverlappingBookingsSingle(
            @Param("roomId") Long roomId,
            @Param("newCheckInDate") LocalDate newCheckIn,
            @Param("newCheckOutDate") LocalDate newCheckOut);

}
