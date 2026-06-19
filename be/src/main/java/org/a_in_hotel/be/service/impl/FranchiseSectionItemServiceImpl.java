package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.dto.request.FranchiseSectionItemRequest;
import org.a_in_hotel.be.dto.response.FileUploadMeta;
import org.a_in_hotel.be.dto.response.FranchiseSectionItemResponse;
import org.a_in_hotel.be.entity.FranchiseSection;
import org.a_in_hotel.be.entity.FranchiseSectionItem;
import org.a_in_hotel.be.entity.Image;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.mapper.FranchiseSectionItemMapper;
import org.a_in_hotel.be.mapper.ImageMapper;
import org.a_in_hotel.be.repository.FranchiseSectionItemRepository;
import org.a_in_hotel.be.repository.FranchiseSectionRepository;
import org.a_in_hotel.be.repository.ImageRepository;
import org.a_in_hotel.be.service.FranchiseSectionItemService;
import org.a_in_hotel.be.util.GeneralService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FranchiseSectionItemServiceImpl implements FranchiseSectionItemService {

    private final FranchiseSectionItemRepository repository;

    private final FranchiseSectionRepository franchiseSectionRepository;

    private final GeneralService generalService;

    private final FranchiseSectionItemMapper mapper;

    private final ImageMapper imageMapper;

    private static  final List<String> SEARCH_FIELDS = List.of("title");

    private final SecurityUtils securityUtils;
    private final ImageRepository imageRepository;

    @Override
    @Transactional
    public void save(FranchiseSectionItemRequest request, MultipartFile file) {
        FranchiseSection section = franchiseSectionRepository
                .findById(request.getSectionId())
                .orElseThrow(() -> new ErrorHandler(
                        HttpStatus.NOT_FOUND,
                        "Section không tồn tại"
                ));
        FranchiseSectionItem item =
                mapper.toEntity(request,securityUtils.getCurrentUserId());
        item.setSection(section);
        if (item.getSortOrder() == null) {
            item.setSortOrder(0);
        }

        if (item.getActive() == null) {
            item.setActive(true);
        }
       item= repository.save(item);
        if(file!=null && !file.isEmpty()){
            try {
                FileUploadMeta fileUploadMeta = generalService.saveFile(file,"franchise-section-item");
                Image franchiseSectionItemImage = imageMapper.toBannerImage(fileUploadMeta);
                franchiseSectionItemImage.setEntityType("franchise-section-item");
                franchiseSectionItemImage.setEntityId(item.getId());
                imageRepository.save(franchiseSectionItemImage);
            }catch (Exception e){
                throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR,"Lỗi khi lưu hình ảnh: " + e.getMessage());
            }
        }
    }

    @Override
    @Transactional
    public void update(Long id, FranchiseSectionItemRequest request,MultipartFile file) {
        FranchiseSectionItem item = repository
                .findById(id)
                .orElseThrow(()->new ErrorHandler(
                        HttpStatus.NOT_FOUND,
                        "Item không tồn tại"
                ));
        Image oldImage = imageRepository.findFirstByEntityIdAndEntityType(
                item.getId(),
                "franchise-section-item"
        ).orElse(null);
        FranchiseSection section = franchiseSectionRepository
                .findById(request.getSectionId())
                .orElseThrow(()->new ErrorHandler(
                        HttpStatus.NOT_FOUND,
                        "Section không tồn tại"
                ));
        mapper.update(request,item,securityUtils.getCurrentUserId());
        if(file!=null && !file.isEmpty()){
            if(oldImage!=null){
                try {
                    generalService.deleFile(oldImage.getUrl());
                }catch (Exception e){
                    log.warn("⚠️ Không thể xóa ảnh cũ {}: {}", oldImage.getUrl(), e.getMessage());
                }
                imageRepository.delete(oldImage);
            }
            FileUploadMeta meta;
            try {
                meta = generalService.saveFile(file,"franchise-section-item");
            }catch (IOException e){
                throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR,"Lỗi upload file: " + e.getMessage());
            }
            Image newImage = imageMapper.toBannerImage(meta);
            newImage.setEntityType("franchise-section-item");
            newImage.setEntityId(item.getId());
            imageRepository.save(newImage);
        }
        item.setSection(section);
        repository.save(item);
    }

    @Override
    public Page<FranchiseSectionItemResponse> getAll(Integer page, Integer size,
                                                     String sort, String filter,
                                                     String searchField, String searchValue, boolean all) {
        log.info("fetching list of franchise section item");
        Specification<FranchiseSectionItem> sortable = RSQLJPASupport.toSort(sort);
        Specification<FranchiseSectionItem> filterable = RSQLJPASupport.toSpecification(filter);
        Specification<FranchiseSectionItem> searchable = SearchHelper.buildSearchSpec(
                searchField, searchValue,SEARCH_FIELDS
        );
        Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
        return repository.findAll(
                sortable
                        .and(filterable)
                        .and(searchable.and(filterable)),
                pageable
        ).map(franchiseSectionItem -> mapper.toResponse(franchiseSectionItem,imageRepository));
    }

    @Override
    public FranchiseSectionItemResponse findById(Long id) {
        return repository.findById(id)
                .map(franchiseSectionItem -> mapper.toResponse(franchiseSectionItem,imageRepository))
                .orElseThrow(()->new EntityNotFoundException("Franchise section item not found with id"));
    }
}
