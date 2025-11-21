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
}
