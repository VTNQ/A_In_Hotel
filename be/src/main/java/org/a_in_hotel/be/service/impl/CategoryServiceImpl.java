package org.a_in_hotel.be.service.impl;


import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.dto.request.CategoryDTO;
import org.a_in_hotel.be.dto.response.CategoryResponse;
import org.a_in_hotel.be.dto.response.RoomTypeResponse;
import org.a_in_hotel.be.entity.Asset;
import org.a_in_hotel.be.entity.Category;
import org.a_in_hotel.be.entity.Image;
import org.a_in_hotel.be.entity.Room;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.exception.NotFoundException;
import org.a_in_hotel.be.mapper.CategoryMapper;
import org.a_in_hotel.be.repository.*;
import org.a_in_hotel.be.repository.projection.KeyCount;
import org.a_in_hotel.be.service.CategoryService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repo;
    private final CategoryMapper mapper;
    private static final List<String> SEARCH_FIELDS = List.of("code","name");
    private final SecurityUtils securityUtils;
    private final RoomRepository roomRepository;
    private final ExtraServiceRepository extraServiceRepository;
    private final AssetRepository assetRepository;
    private final ImageRepository imageRepository;
    @Override
    public void create(CategoryDTO dto) {
        Category entity = mapper.toEntity(dto,securityUtils.getCurrentUserId());
        repo.save(entity);
    }

    @Override
    public void update(Long id, CategoryDTO dto) {
        Category entity = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found: " + id));
        mapper.updateEntityFromDTO(dto, entity,securityUtils.getCurrentUserId());
        repo.save(entity);
    }

    @Override
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new NotFoundException("Category not found: " + id);
        repo.deleteById(id);
    }

    @Override
    public void softDelete(Long id) {
        // chỉ dùng khi bạn thêm field active vào entity
        Category entity = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found: " + id));
        // entity.setActive(false); // cần thêm field active vào Category
        repo.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse get(Long id) {
        try {
            log.info("Start get category by id: {}", id);
            Category category = repo.findById(id)
                    .orElseThrow(() -> new NotFoundException("Category not found: " + id));
            Long capacity = 0L;
            switch (category.getType()){
                case 1 ->{
                    capacity = roomRepository.countByRoomTypeIds(List.of(category.getId()))
                            .stream()
                            .findFirst()
                            .map(KeyCount::getCnt)
                            .orElse(0L);
                    break;
                }
                case 2 -> {
                    capacity = extraServiceRepository.countByCategoryIds(List.of(category.getId()))
                            .stream()
                            .findFirst()
                            .map(KeyCount::getCnt)
                            .orElse(0L);
                    break;
                }
                case 3 -> {
                    capacity = assetRepository.countByCategoryIds(List.of(category.getId()))
                            .stream()
                            .findFirst()
                            .map(KeyCount::getCnt)
                            .orElse(0L);
                    break;
                }
            }
            category.setCapacity(capacity);
            return mapper.toDTO(category);
        }catch (Exception e){
            log.error("Error get category by id: {}", e.getMessage(), e);
            throw e;
        }
    }



    @Override
    public void updateStatus(Long id, boolean status) {
        try {
            log.info("start update category status");
            Category category = repo.getReferenceById(id);
            category.setIsActive(status);
            category.setUpdatedBy(String.valueOf(securityUtils.getCurrentUserId()));
            repo.save(category);
        }catch (EntityNotFoundException e){
            log.warn("⚠️ category with id {} not found: {}", id, e.getMessage());
            throw new ErrorHandler(HttpStatus.NOT_FOUND, "Không tìm thấy category có ID: " + id);
        }catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public Page<CategoryResponse> search(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all) {
        try {
            log.info("start to get list categories");
            Specification<Category>sortable= RSQLJPASupport.toSort(sort);
            Specification<Category>filterable= RSQLJPASupport.toSpecification(filter);
            Specification<Category>searchable= SearchHelper.buildSearchSpec(searchField,searchValue,SEARCH_FIELDS);
            Pageable pageable= all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
            Page<Category> result = repo.findAll(sortable.and(filterable).and(searchable), pageable);
            List<Category>list=result.getContent();
            if(list.isEmpty())return result.map(mapper::toDTO);
            List<Long> roomIds = list.stream().filter(c -> c.getType() == 1).map(Category::getId).toList();
            List<Long> extraIds = list.stream().filter(c -> c.getType() == 2).map(Category::getId).toList();
            List<Long> assetIds = list.stream().filter(c -> c.getType() == 3).map(Category::getId).toList();
            Map<Long, Long> roomMap = roomIds.isEmpty() ? Map.of() :
                    roomRepository.countByRoomTypeIds(roomIds).stream()
                            .collect(Collectors.toMap(KeyCount::getKeyId, KeyCount::getCnt));

            Map<Long, Long> extraMap = extraIds.isEmpty() ? Map.of() :
                    extraServiceRepository.countByCategoryIds(extraIds).stream()
                            .collect(Collectors.toMap(KeyCount::getKeyId, KeyCount::getCnt));

            Map<Long, Long> assetMap = assetIds.isEmpty() ? Map.of() :
                    assetRepository.countByCategoryIds(assetIds).stream()
                            .collect(Collectors.toMap(KeyCount::getKeyId, KeyCount::getCnt));

            // Gán capacity
            list.forEach(c -> {
                long cap = switch (c.getType()) {
                    case 1 -> roomMap.getOrDefault(c.getId(), 0L);
                    case 2 -> extraMap.getOrDefault(c.getId(), 0L);
                    case 3 -> assetMap.getOrDefault(c.getId(), 0L);
                    default -> 0L;
                };
                c.setCapacity(cap);
            });
            return result.map(mapper::toDTO);
        }catch (Exception e){
            e.printStackTrace();
            log.error(e.getMessage());
            return null;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomTypeResponse> getRoomTypesByHotel(Long hotelId) {
        log.info("Get room types by hotel id: {}", hotelId);

        // 1. Lấy danh sách room type (Category)
        List<Category> roomTypes = repo.findRoomTypeByHotel(hotelId);
        if (roomTypes.isEmpty()) return List.of();

        // 2. Lấy roomId
        List<Long> roomIds = roomTypes.stream()
                .flatMap(rt -> rt.getRooms().stream())
                .map(Room::getId)
                .distinct()
                .toList();

        // 3. Lấy asset theo roomId
        List<Asset> assets = roomIds.isEmpty()
                ? List.of()
                : assetRepository.findByRoomIds(roomIds);

        // 4. Lấy image cho asset và gán thumbnail
        if (!assets.isEmpty()) {
            Map<Long, Image> imageMap = imageRepository
                    .findByEntityTypeAndEntityIdIn(
                            "Asset",
                            assets.stream().map(Asset::getId).toList()
                                                  )
                    .stream()
                    .collect(Collectors.toMap(
                            Image::getEntityId,
                            Function.identity(),
                            (a, b) -> a
                                             ));

            assets.forEach(a -> a.setThumbnail(imageMap.get(a.getId())));
        }

        // 5. Map sang response
        return roomTypes.stream()
                .map(mapper::toRoomTypeResponse)
                .toList();
    }


}