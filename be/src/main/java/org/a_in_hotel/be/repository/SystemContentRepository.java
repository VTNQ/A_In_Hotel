package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.SystemContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SystemContentRepository extends JpaRepository<SystemContent,Long> {
    Optional<SystemContent> findByContentKey(Integer contentKey);
}
