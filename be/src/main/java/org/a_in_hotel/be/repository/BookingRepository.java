package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.dto.response.BookingSummaryResponse;
import org.a_in_hotel.be.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

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
      And b.status not in (3,4)
""")
    boolean existsOverlappingBookingsSingle(
            @Param("roomId") Long roomId,
            @Param("newCheckInDate") LocalDate newCheckIn,
            @Param("newCheckOutDate") LocalDate newCheckOut);

    @Query("""
    SELECT b FROM Booking b
    WHERE b.BookingPackage IN :packages
      AND b.status = :status""")
    List<Booking> findBookingsForRoomUpdate(
            @Param("packages") List<Integer> bookingPackages,
            @Param("status") Integer status);
    @Query("""
    select distinct b
    from Booking b
    join fetch b.details d
    where b.id = :id
      and d.active = true
""")
    Optional<Booking> findByIdFetchActiveDetail(Long id);

    @Query("""
    select
        count(b.id),
        coalesce(
            sum(function('DATEDIFF', b.checkOutDate, b.checkInDate)),
            0
        ),
        coalesce(
            sum(
                case 
                    when b.status = :completedStatus 
                    then b.totalPrice 
                    else 0.0 
                end
            ),
            0.0
        )
    from Booking b
    where b.customer.id = :customerId
""")
    List<Object[]> getBookingSummaryRaw(
            @Param("customerId") Long customerId,
            @Param("completedStatus") Integer completedStatus
    );



}
