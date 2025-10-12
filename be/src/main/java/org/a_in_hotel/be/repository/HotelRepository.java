package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface HotelRepository extends JpaRepository<Hotel, Long>, JpaSpecificationExecutor<Hotel> {
    Optional<Hotel> findByAccount_Id(Long accountId);
    Optional<Hotel> findByAccount_IdAndIdNot(Long accountId, Long id);
}
