package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.dto.request.RoomTypeRequest;
import org.a_in_hotel.be.entity.RoomType;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.exception.NotFoundException;
import org.a_in_hotel.be.mapper.RoomTypeMapper;
import org.a_in_hotel.be.repository.RoomTypeRepository;
import org.a_in_hotel.be.service.RoomTypeService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class RoomTypeServiceImpl implements RoomTypeService {
    private final RoomTypeRepository roomTypeRepository;
    private final RoomTypeMapper roomTypeMapper;
    private final SecurityUtils securityUtils;
    private static final List<String> SEARCH_FIELDS = List.of("name");

    @Autowired
    public RoomTypeServiceImpl(
            RoomTypeRepository roomTypeRepository,
            RoomTypeMapper roomTypeMapper,
            SecurityUtils securityUtils) {
        this.roomTypeRepository = roomTypeRepository;
        this.roomTypeMapper = roomTypeMapper;
        this.securityUtils = securityUtils;
    }

    @Override
    public void save(RoomTypeRequest request) {
        try {
            RoomType roomType = roomTypeMapper.toEntity(request, securityUtils.getCurrentUserId());
            roomTypeRepository.save(roomType);
        } catch (Exception e) {
            log.error("save room type error :{}", e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void update(Long id, RoomTypeRequest request) {
        try {
            log.info("start update room type");
            RoomType roomType = roomTypeRepository.getReferenceById(id);
            roomTypeMapper.updateEntity(request, roomType, securityUtils.getCurrentUserId());
            roomTypeRepository.save(roomType);
        } catch (EntityNotFoundException e) {
            log.warn("Room type with id {} not found: {}", id, e.getMessage());
        } catch (Exception e) {
            log.error("update room type error :{}", e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public Page<RoomType> getAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all) {
        try {
            log.info("start get all room type");
            Specification<RoomType> sortable = RSQLJPASupport.toSort(sort);
            Specification<RoomType> filterable = RSQLJPASupport.toSpecification(filter);
            Specification<RoomType> searchable = SearchHelper.buildSearchSpec(searchField, searchValue, SEARCH_FIELDS);
            Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
            return roomTypeRepository.findAll(sortable.and(filterable).and(searchable), pageable);
        } catch (Exception e) {
            log.error("get all room type error :{}", e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public RoomType getById(Long id) {
        try {
            log.info("start get room type by id:{}", id);
            return roomTypeRepository.findById(id).orElseThrow(()->new
                    NotFoundException("Room Type not found with id: " + id ));
        } catch (Exception e) {
            log.error("get room type by id error :{}", e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public void updateStatus(Long id, boolean status) {
        try {
            log.info("start update room type status");
            RoomType roomType = roomTypeRepository.getReferenceById(id);
            roomType.setIsActive(status);
            roomType.setUpdatedBy(String.valueOf(securityUtils.getCurrentUserId()));
            roomTypeRepository.save(roomType);
        }catch (EntityNotFoundException e){
            log.warn("Room type with id {} not found: {}", id, e.getMessage());
            throw new ErrorHandler(HttpStatus.NOT_FOUND,"Không tìm thấy loại phòng có Id: " + id );
        }
    }

}
