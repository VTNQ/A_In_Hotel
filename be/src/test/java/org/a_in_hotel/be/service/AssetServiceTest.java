package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.response.AssetResponse;
import org.a_in_hotel.be.entity.Asset;
import org.a_in_hotel.be.mapper.AssetMapper;
import org.a_in_hotel.be.repository.AssetRepository;
import org.a_in_hotel.be.repository.ImageRepository;
import org.a_in_hotel.be.service.impl.AssetServiceImpl;
import org.a_in_hotel.be.util.SecurityUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AssetServiceTest {

    @Mock
    private AssetRepository assetRepository;

    @Mock
    private AssetMapper assetMapper;

    @Mock
    private ImageRepository imageRepository;

    @Mock
    private SecurityUtils securityUtils;

    @InjectMocks
    private AssetServiceImpl assetService;

    @Test
    void getById_shouldReturnAsset_WhenAssetExists(){
        Asset asset = new Asset();
        asset.setId(12L);
        asset.setAssetName("Air Conditioning");

        AssetResponse response = new AssetResponse();
        response.setAssetName("Air Conditioning");
        doReturn(Optional.of(asset))
                .when(assetRepository)
                .findById(12L);

        doReturn(response)
                .when(assetMapper)
                .toResponse(any(Asset.class), any(ImageRepository.class));


        AssetResponse result = assetService.getById(12L);

        assertNotNull(result);
        assertEquals("Air Conditioning", result.getAssetName());
        verify(assetRepository).findById(12L);
    }

    @Test
    void getById_shouldThrowException_whenAssetNotFound(){
        Long id =12L;
        doReturn(Optional.empty())
                .when(assetRepository)
                .findById(id);

        assertThrows(IllegalArgumentException.class, () -> {
            assetService.getById(id);
        });
        verify(assetRepository).findById(id);
    }
}
