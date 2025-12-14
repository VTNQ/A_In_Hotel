package org.a_in_hotel.be.service.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.dto.request.SystemContentRequest;
import org.a_in_hotel.be.dto.response.FileUploadMeta;
import org.a_in_hotel.be.dto.response.SystemContentResponse;
import org.a_in_hotel.be.entity.Image;
import org.a_in_hotel.be.entity.SystemContent;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.mapper.ImageMapper;
import org.a_in_hotel.be.mapper.SystemContentMapper;
import org.a_in_hotel.be.repository.ImageRepository;
import org.a_in_hotel.be.repository.SystemContentRepository;
import org.a_in_hotel.be.service.SystemContentService;
import org.a_in_hotel.be.util.GeneralService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@Slf4j
@RequiredArgsConstructor
public class SystemContentServiceImpl implements SystemContentService {

    private final SystemContentRepository repository;

    private final SystemContentMapper mapper;

    private final ImageRepository imageRepository;

    private final GeneralService generalService;

    private final ImageMapper imageMapper;
    @Override
    public void update(Long id,SystemContentRequest request, MultipartFile file) {
        try {
            SystemContent content = repository.getReferenceById(id);
            Image oldImage =imageRepository.findFirstByEntityIdAndEntityType(content.getId(), "system")
                    .orElse(null);
            mapper.updateEntity(request, content);
            if(file!=null && !file.isEmpty()){
                if(oldImage!=null){
                    try {
                        generalService.deleFile(oldImage.getUrl());
                    }catch (Exception e) {
                        log.warn("⚠️ Không thể xóa ảnh cũ {}: {}", oldImage.getUrl(), e.getMessage());
                    }
                    imageRepository.delete(oldImage);
                }
                FileUploadMeta meta;
                try {
                    meta = generalService.saveFile(file, "system");
                }catch (IOException e) {
                    throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi upload file: " + e.getMessage());
                }
                Image newImage = imageMapper.toBannerImage(meta);
                newImage.setEntityType("system");
                newImage.setEntityId(content.getContentKey().longValue());
                imageRepository.save(newImage);
            }
            repository.save(content);
        }catch (EntityNotFoundException e){
            log.error("System Content.update: entity not found {}",e.getMessage());
            throw e;
        }
    }

    @Override
    public SystemContentResponse findByContentKey(Integer contentKey) {
        SystemContent content = repository.findByContentKey(contentKey)
                .orElseThrow(()->new IllegalArgumentException("system content not found"));
        imageRepository.findFirstByEntityIdAndEntityType(content.getContentKey().longValue(), "system")
                .ifPresent(content::setBackgroundImage);
        return  mapper.toResponse(content);
    }
}
