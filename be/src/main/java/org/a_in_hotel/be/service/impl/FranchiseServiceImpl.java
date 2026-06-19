package org.a_in_hotel.be.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.dto.request.FranchiseRequest;
import org.a_in_hotel.be.dto.response.FileUploadMeta;
import org.a_in_hotel.be.dto.response.FranchiseResponse;
import org.a_in_hotel.be.entity.Franchise;
import org.a_in_hotel.be.entity.Image;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.mapper.FranchiseMapper;
import org.a_in_hotel.be.mapper.ImageMapper;
import org.a_in_hotel.be.repository.FranchiseRepository;
import org.a_in_hotel.be.repository.ImageRepository;
import org.a_in_hotel.be.service.FranchiseService;
import org.a_in_hotel.be.util.GeneralService;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class FranchiseServiceImpl implements FranchiseService {
    private final FranchiseRepository repository;

    private final FranchiseMapper mapper;

    private final SecurityUtils securityUtils;

    private final GeneralService generalService;

    private final ImageMapper imageMapper;

    private final ImageRepository imageRepository;
    @Override
    public void saveOrUpdate(FranchiseRequest request, MultipartFile file) {
        Franchise franchise = repository.findFirstBy()
                .orElseGet(Franchise::new);
        mapper.toEntity(franchise,request,securityUtils.getCurrentUserId());
        franchise =repository.save(franchise);
        if(file!=null && !file.isEmpty()){
            try {
                FileUploadMeta fileUploadMeta = generalService.saveFile(file,"franchise");
                Image franchiseImage = imageMapper.toBannerImage(fileUploadMeta);
                franchiseImage.setEntityType("franchise");
                franchiseImage.setEntityId(franchise.getId());
                imageRepository.save(franchiseImage);
            }catch (Exception e){
                throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR,"Lỗi khi lưu hình ảnh: " + e.getMessage());
            }
        }
        log.info("franchise created successfully by {}",securityUtils.getCurrentUserId().toString());
    }

    @Override
    public FranchiseResponse getFranchise() {
        Franchise franchise = repository.findById(1L)
                .orElseThrow(()->new IllegalArgumentException("franchise not found"));
        return mapper.toResponse(franchise,imageRepository);
    }
}
