package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.AssetHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssetHistoryRepository extends JpaRepository<AssetHistory, Long> {
    List<AssetHistory> findByAssetIdOrderByCreatedAtDesc(Long assetId);
}
