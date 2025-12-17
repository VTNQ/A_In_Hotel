package org.a_in_hotel.be.service.impl;

import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.common.constant.EntityTypeConst;
import org.a_in_hotel.be.dto.response.FacilityResponse;
import org.a_in_hotel.be.dto.response.ImageResponse;
import org.a_in_hotel.be.entity.Asset;
import org.a_in_hotel.be.entity.ExtraService;
import org.a_in_hotel.be.entity.Image;
import org.a_in_hotel.be.repository.AssetRepository;
import org.a_in_hotel.be.repository.ExtraServiceRepository;
import org.a_in_hotel.be.repository.ImageRepository;
import org.a_in_hotel.be.service.FacilityService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FacilityServiceImpl implements FacilityService {

    private final ExtraServiceRepository extraServiceRepository;
    private final AssetRepository assetRepository;
    private final ImageRepository imageRepository;
    @Override
    public List<FacilityResponse> getFacilitiesAndServices() {
        List<FacilityResponse> result = new ArrayList<>();
        final int LIMIT = 10;
        final int EXTRA_LIMIT = 5;

        // 1. Extra service ưu tiên (page 0)
        List<ExtraService> firstExtras =
                extraServiceRepository.findFreeExtra(
                        PageRequest.of(0, EXTRA_LIMIT)
                                                    );

        result.addAll(
                firstExtras.stream()
                        .map(this::mapExtraService)
                        .toList()
                     );

        // 2. Asset
        int remain = LIMIT - result.size();
        if (remain > 0) {
            List<Asset> assets =
                    assetRepository.findAssets(PageRequest.of(0, remain));

            result.addAll(
                    assets.stream()
                            .map(this::mapAsset)
                            .toList()
                         );
        }

        // 3. Extra service bù (page 1, CÙNG SIZE)
        remain = LIMIT - result.size();
        if (remain > 0) {
            List<ExtraService> extraFallback =
                    extraServiceRepository.findFreeExtra(
                            PageRequest.of(1, EXTRA_LIMIT)
                                                        );

            result.addAll(
                    extraFallback.stream()
                            .limit(remain) // chỉ lấy phần cần
                            .map(this::mapExtraService)
                            .toList()
                         );
        }

        return result;
    }
    private FacilityResponse mapExtraService(ExtraService service) {
        return new FacilityResponse(
                service.getId(),
                service.getServiceName(),
                EntityTypeConst.EXTRA_SERVICE,
                mapImage(EntityTypeConst.EXTRA_SERVICE, service.getId())
        );
    }

    private FacilityResponse mapAsset(Asset asset) {
        return new FacilityResponse(
                asset.getId(),
                asset.getAssetName(),
                EntityTypeConst.ASSET,
                mapImage(EntityTypeConst.ASSET, asset.getId())
        );
    }
    private ImageResponse mapImage(String entityType, Long entityId) {

        Image image = imageRepository
                .findByEntityTypeAndEntityId(entityType, entityId);

        if (image == null) {
            return null;
        }

        return new ImageResponse(
                image.getUrl(),
                image.getAltText()
        );
    }
}
