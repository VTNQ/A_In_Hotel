package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AssetRepository extends JpaRepository<Asset, Long>, JpaSpecificationExecutor<Asset> {
    boolean existsByAssetCode(String assetCode);

    Long countByCategoryId(Long categoryId);
}
