package com.example.bannerservice.service.impl;

import com.example.bannerservice.client.FileUpload;
import com.example.bannerservice.dto.RequestResponse;
import com.example.bannerservice.dto.request.BannerRequest;
import com.example.bannerservice.dto.response.FileUploadMeta;
import com.example.bannerservice.entity.Banner;
import com.example.bannerservice.entity.BannerImage;
import com.example.bannerservice.exception.ErrorHandler;
import com.example.bannerservice.mapper.BannerImageMapper;
import com.example.bannerservice.mapper.BannerMapper;
import com.example.bannerservice.repository.BannerImageRepository;
import com.example.bannerservice.repository.BannerRepository;
import com.example.bannerservice.service.BannerService;
import com.example.bannerservice.util.SearchHelper;
import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BannerServiceImpl implements BannerService {
    @Autowired
    private BannerMapper bannerMapper;
    @Autowired
    private FileUpload fileUpload;
    @Autowired
    private BannerImageMapper  bannerImageMapper;
    @Autowired
    private BannerImageRepository bannerImageRepository;
    @Autowired
    private BannerRepository bannerRepository;
    private static final List<String> SEARCH_FIELDS = List.of("name");
    @Override
    @Transactional
    public void save(BannerRequest bannerRequest, MultipartFile mainImage) {
        try {
            BannerImage bannerImage = new BannerImage();
            if(mainImage != null && !mainImage.isEmpty()) {
                try {
                    RequestResponse<FileUploadMeta> fileUploadMeta=fileUpload.uploadFile(mainImage,"banner/");
                     bannerImage=bannerImageMapper.toBannerImage(fileUploadMeta.getData());
                    bannerImageRepository.save(bannerImage);
                }catch (Exception e) {
                    throw new RuntimeException("Lỗi khi lưu hình ảnh: " + e.getMessage(), e);
                }
            }
            log.info("start to save banner : {}", bannerRequest);
            Banner banner = bannerMapper.toEntity(bannerRequest);

            banner.setImage(bannerImage);
            bannerRepository.save(banner);
            log.info("end to save banner : {}", bannerRequest);
        }catch (Exception e){
            log.error("save banner error : {}", bannerRequest, e);
            throw e;
        }
    }

    @Override
    @Transactional
    public void update(Long id, BannerRequest bannerRequest,MultipartFile image) {
        try {
            log.info("start to update banner : {}", bannerRequest);
            Banner banner=bannerRepository.getReferenceById(id);
            bannerMapper.updateEntityFromDto(bannerRequest,banner);

            bannerRepository.save(banner);
            if(image != null && !image.isEmpty()) {
                try {
                    RequestResponse<FileUploadMeta> fileUploadMeta=fileUpload.uploadFile(image,"banner/");
                    BannerImage bannerImage=bannerImageMapper.toBannerImage(fileUploadMeta.getData());
                    bannerImageRepository.save(bannerImage);
                }catch (Exception e) {
                    throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi lưu hình ảnh: " + e.getMessage());
                }
            }
            log.info("end to update banner : {}", bannerRequest);
        }catch (Exception e){
            e.printStackTrace();
            log.error("update banner error : {}",bannerRequest);
        }
    }

    @Override
    public Page<Banner> getListBanner(Integer page, Integer size, String sort, String filter, String search, boolean all) {
        try {
            log.info("start to get list banner ");
            Specification<Banner>sortable= RSQLJPASupport.toSort(sort);
            Specification<Banner>filterable= RSQLJPASupport.toSpecification(filter);
            Specification<Banner>searchable= SearchHelper.parseSearchToken(search, SEARCH_FIELDS);
            Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
            Page<Banner>response=bannerRepository.findAll(sortable.and(filterable).and(searchable), pageable);
            return response;
        }catch (Exception e){
            e.printStackTrace();
            log.error(e.getMessage());
            return null;
        }
    }

    @Override
    public Banner findById(Long id) {
        return bannerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Banner not found with id: " + id));
    }

}
