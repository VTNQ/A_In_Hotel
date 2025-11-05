package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Asset;
import org.a_in_hotel.be.repository.projection.KeyCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AssetRepository extends JpaRepository<Asset, Long>, JpaSpecificationExecutor<Asset> {
    boolean existsByAssetCode(String assetCode);

    @Query("""
    SELECT a.category.id AS keyId, COUNT(a.id) AS cnt
    FROM Asset a
    WHERE a.category.id IN :ids
    GROUP BY a.category.id
""")
    List<KeyCount> countByCategoryIds(@Param("ids") List<Long> ids);

}
