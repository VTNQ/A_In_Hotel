package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Room;
import org.a_in_hotel.be.repository.projection.KeyCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long>, JpaSpecificationExecutor<Room> {
    @Query("""
    SELECT r.roomType.id AS keyId, COUNT(r.id) AS cnt
    FROM Room r
    WHERE r.roomType.id IN :ids
    GROUP BY r.roomType.id
""")
    List<KeyCount> countByRoomTypeIds(@Param("ids") List<Long> ids);
    boolean existsByRoomNumberAndHotelId(String roomNumber, Long hotelId);

    @Query("select r from Room r "
           + " where r.createdAt = ("
           + " select min(r2.createdAt)"
           + " from Room  r2 "
           + "where r.hotel.id = r2.hotel.id and r.status =3 and r.hotel.status=1)")
    List<Room> findFirstRoomOfEachHotel();

    @Query("SELECT  count(r) from Room r where (:hotelId IS NULL OR r.hotel.id = :hotelId)")
    Long countTotalRooms(Long hotelId);

    @Query("SELECT count(r) from Room r where r.status = :status and (:hotelId IS NULL OR r.hotel.id = :hotelId)")
    Long countByStatus(Long hotelId,Integer status);
}
