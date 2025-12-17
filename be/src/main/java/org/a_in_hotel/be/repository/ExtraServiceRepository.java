package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.ExtraService;
import org.a_in_hotel.be.repository.projection.KeyCount;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExtraServiceRepository extends JpaRepository<ExtraService, Long>, JpaSpecificationExecutor<ExtraService> {
    @Query("""
    SELECT e.category.id AS keyId, COUNT(e.id) AS cnt
    FROM ExtraService e
    WHERE e.category.id IN :ids
    GROUP BY e.category.id
""")
    List<KeyCount> countByCategoryIds(@Param("ids") List<Long> ids);
    @Query("""
  SELECT e
  FROM ExtraService e
  WHERE e.price = 0
    AND e.isActive = true
  ORDER BY e.createdAt
""")
    List<ExtraService> findFreeExtra(Pageable pageable);
}
