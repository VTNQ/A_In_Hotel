package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image,Long>, JpaSpecificationExecutor<Image> {
    Optional<Image> findFirstByEntityIdAndEntityType(Long entityId, String entityType);

    List<Image> findByEntityTypeAndEntityIdIn(String entityType, List<Long> entityIds);

    Image findByEntityTypeAndEntityId(String entityType, Long entityId);
}
