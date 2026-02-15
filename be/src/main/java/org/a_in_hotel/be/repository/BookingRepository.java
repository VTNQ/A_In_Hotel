package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.dto.response.BookingSummaryResponse;
import org.a_in_hotel.be.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
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

    @Query("SELECT COUNT(b) from Booking b where b.createdAt BETWEEN :start and :end" +
            " and (:hotelId IS NULL OR b.hotelId = :hotelId)")
    Long countBookingBetween(OffsetDateTime start,OffsetDateTime end,Long hotelId);

    @Query("select count(b) from Booking b where b.checkedInAt between :start and :end " +
            "and (:hotelId IS NULL OR b.hotelId = :hotelId)")
    Long countCheckInBetween(OffsetDateTime start,OffsetDateTime end,Long hotelId);

    @Query("select count (b) from Booking b where b.checkedOutAt between :start and :end " +
            "and (:hotelId IS NULL OR b.hotelId = :hotelId)")
    Long countCheckOutBetween(OffsetDateTime start,OffsetDateTime end,Long hotelId);
    @Query("select COALESCE(SUM(b.totalPrice),0) from Booking b where b.checkedOutAt BETWEEN :start and :end " +
            "and (:hotelId IS NULL OR b.hotelId = :hotelId)")
    BigDecimal sumRevenueBetween(OffsetDateTime start, OffsetDateTime end,Long hotelId);
    @Query("SELECT FUNCTION('DATE',b.checkedOutAt),COALESCE(SUM(b.totalPrice),0) from Booking b" +
            " where b.checkedOutAt >= :startDate GROUP BY function('DATE',b.checkedOutAt) " +
            " order by function('DATE',b.checkedOutAt) ")
    List<Object[]> getRevenueLast(OffsetDateTime startDate);
    @Query("SELECT function('DATE',b.createdAt)," +
            "SUM(CASE when b.status = 1 THEN 1 ELSE 0 END )," +
            "SUM(CASE when b.status = 4 THEN 1 ELSE 0 END ) from Booking b " +
            "WHERE b.createdAt >= :startDate and b.hotelId = :hotelId " +
            "GROUP BY function('DATE',b.createdAt)" +
            "ORDER BY function('DATE',b.createdAt) ")
    List<Object[]> getReservation(OffsetDateTime startDate,Long hotelId);


}
