package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RoomRepository extends JpaRepository<Room,Long>, JpaSpecificationExecutor<Room> {
}
