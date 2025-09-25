package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.dto.request.BannerRequest;
import org.a_in_hotel.be.dto.response.FileUploadMeta;
import org.a_in_hotel.be.entity.Banner;
import org.a_in_hotel.be.entity.BannerImage;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.mapper.BannerImageMapper;
import org.a_in_hotel.be.mapper.BannerMapper;
import org.a_in_hotel.be.repository.BannerImageRepository;
import org.a_in_hotel.be.repository.BannerRepository;
import org.a_in_hotel.be.service.BannerService;
import org.a_in_hotel.be.util.GeneralService;
import org.a_in_hotel.be.util.SearchHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Slf4j
public class BannerServiceImpl implements BannerService {
    @Autowired
    private GeneralService generalService;
    @Autowired
    private BannerImageRepository bannerImageRepository;
    @Autowired
    private BannerImageMapper bannerImageMapper;
    @Autowired
    private BannerRepository bannerRepository;
    @Autowired
    private BannerMapper bannerMapper;
    private static final List<String> SEARCH_FIELDS = List.of("name");

    @Override
    @Transactional
    public void save(BannerRequest bannerRequest, MultipartFile image) {
        try {
            BannerImage bannerImage = new BannerImage();
            if (image != null && !image.isEmpty()) {
                try {
                    FileUploadMeta file = generalService.saveFile(image, "banner");
                    bannerImage = bannerImageMapper.toBannerImage(file);
                    bannerImageRepository.save(bannerImage);
                } catch (Exception e) {
                    throw new RuntimeException("Lỗi khi lưu hình ảnh: " + e.getMessage(), e);
                }
            }
            log.info("start to save banner : {}", bannerRequest);
            Banner banner = bannerMapper.toEntity(bannerRequest);

            banner.setImage(bannerImage);
            bannerRepository.save(banner);
            log.info("end to save banner : {}", bannerRequest);
        } catch (Exception e) {
            log.error("save banner error : {}", bannerRequest, e);
            throw e;
        }
    }

    @Override
    public void update(Long id, BannerRequest bannerRequest, MultipartFile image) {
        try {
            log.info("start to update banner : {}", bannerRequest);
            Banner banner=bannerRepository.getReferenceById(id);
            bannerMapper.updateEntityFromDto(bannerRequest,banner);

            bannerRepository.save(banner);
            if(image != null && !image.isEmpty()) {
                try {
                    FileUploadMeta fileUploadMeta=generalService.saveFile(image,"banner/");
                    BannerImage bannerImage=bannerImageMapper.toBannerImage(fileUploadMeta);
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
    public Page<Banner> getListBanner(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all) {
        try {
            log.info("start to get list banner ");
            Specification<Banner> sortable= RSQLJPASupport.toSort(sort);
            Specification<Banner>filterable= RSQLJPASupport.toSpecification(filter);
            Specification<Banner>searchable= SearchHelper.buildSearchSpec(searchField,searchValue,SEARCH_FIELDS);
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

    @Override
    public void delete(Long id) {
        try {
            log.info("start to delete banner : {}", id);
            Banner banner=bannerRepository.findById(id)
                    .orElseThrow(()->new EntityNotFoundException("Banner not found with id: " + id));
            BannerImage bannerImage=banner.getImage();
            if(bannerImage!=null){
                try {
                    generalService.deleFile(bannerImage.getUrl());
                    bannerImageRepository.delete(bannerImage);
                }catch (Exception e){
                    log.warn("Không thể xóa ảnh trên MinIO hoặc DB cho banner {}: {}", id, e.getMessage());
                }
            }
            bannerRepository.delete(banner);
            log.info("end to delete banner : {}", id);
        }catch (Exception e){
            log.error("delete banner error : {}",e.getMessage());
        }
    }
}
