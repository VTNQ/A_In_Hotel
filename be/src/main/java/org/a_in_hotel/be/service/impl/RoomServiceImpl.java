package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.Enum.RoomStatus;
import org.a_in_hotel.be.dto.request.RoomRequest;
import org.a_in_hotel.be.dto.response.FileUploadMeta;
import org.a_in_hotel.be.dto.response.RoomResponse;
import org.a_in_hotel.be.entity.Image;
import org.a_in_hotel.be.entity.Room;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.mapper.ImageMapper;
import org.a_in_hotel.be.mapper.RoomMapper;
import org.a_in_hotel.be.repository.ImageRepository;
import org.a_in_hotel.be.repository.RoomPriceOptionRepository;
import org.a_in_hotel.be.repository.RoomRepository;
import org.a_in_hotel.be.service.RoomService;
import org.a_in_hotel.be.util.GeneralService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
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

@Slf4j
@Service
public class RoomServiceImpl implements RoomService {
    private final RoomMapper roomMapper;
    private final RoomPriceOptionRepository roomPriceOptionRepository;
    private final RoomRepository roomRepository;
    private static final List<String> SEARCH_FIELDS = List.of("roomNumber","roomName");
    private final GeneralService generalService;
    private final ImageRepository roomImageRepository;
    private final SecurityUtils securityUtils;
    private ImageMapper roomImageMapper;
    @Autowired
    public RoomServiceImpl(RoomMapper roomMapper,
                           RoomRepository roomRepository,
                           GeneralService generalService,
                           ImageRepository roomImageRepository,
                           ImageMapper roomImageMapper,
                           SecurityUtils securityUtils,
                           RoomPriceOptionRepository roomPriceOptionRepository) {
        this.roomMapper = roomMapper;
        this.roomRepository = roomRepository;
        this.generalService=generalService;
        this.roomImageRepository=roomImageRepository;
        this.roomImageMapper=roomImageMapper;
        this.securityUtils=securityUtils;
        this.roomPriceOptionRepository=roomPriceOptionRepository;
    }
    @Override
    @Transactional
    public void save(RoomRequest request, List<MultipartFile>image) {
        try {
            Room room = roomMapper.toEntity(request,securityUtils.getCurrentUserId());
            roomRepository.save(room);
            List<Image> images = new ArrayList<>();
            for (MultipartFile file : image) {
                if(file != null && !file.isEmpty()) {
                    try {
                        FileUploadMeta fileUploadMeta=generalService.saveFile(file,"room");
                        Image roomImage=roomImageMapper.toBannerImage(fileUploadMeta);
                        roomImage.setEntityType("Room");
                        roomImage.setEntityId(room.getId());
                        images.add(roomImage);
                    }catch (Exception e) {
                        throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi lưu hình ảnh: " + e.getMessage());
                    }
                }

            }
            roomImageRepository.saveAll(images);
            room.setImages(images);
            roomPriceOptionRepository.saveAll(room.getRoomPriceOptions());
        }catch (Exception e){
            log.error("save room error : {}",e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void update(Long id, RoomRequest request, List<MultipartFile>image) {
        try {
            Room existing = roomRepository.findById(id)
                    .orElseThrow(() -> new ErrorHandler(HttpStatus.NOT_FOUND, "Phòng không tồn tại"));

            // Cập nhật thông tin cơ bản
            roomMapper.updateEntity(request, existing,securityUtils.getCurrentUserId());

            // Nếu có ảnh mới
            if (image != null && !image.isEmpty()) {
                if (existing.getImages() != null && !existing.getImages().isEmpty()) {
                    for (Image oldImg : existing.getImages()) {
                        try {
                            generalService.deleFile(oldImg.getUrl());
                        } catch (Exception e) {
                            log.warn("⚠️ Không thể xóa ảnh cũ {}: {}", oldImg.getUrl(), e.getMessage());
                        }
                    }
                    existing.getImages().clear();
                }
                List<Image> images = new ArrayList<>();

                for (MultipartFile file : image) {
                    if (file != null && !file.isEmpty()) {
                        FileUploadMeta meta = generalService.saveFile(file, "room");
                        Image imageNew = roomImageMapper.toBannerImage(meta);
                        imageNew.setEntityId(existing.getId());
                        imageNew.setEntityType("Room");
                        images.add(imageNew);
                    }
                }

                // Xóa ảnh cũ (nếu cần)
                existing.getImages().clear();
                existing.getImages().addAll(images);
            }
            roomMapper.updateRoomPriceOptions(request,existing,securityUtils.getCurrentUserId());
            roomRepository.save(existing);

        } catch (Exception e) {
            log.error("Error updating room: {}", e.getMessage(), e);
            throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi cập nhật phòng: " + e.getMessage());
        }
    }

    @Override
    public RoomResponse findById(Long id) {
        try {
            Room room = roomRepository.getReferenceById(id);
            return roomMapper.toResponse(room);
        }catch (EntityNotFoundException e){
            log.warn("⚠️ Room with id {} not found: {}", id, e.getMessage());
            throw new ErrorHandler(HttpStatus.NOT_FOUND, "Không tìm thấy phòng có ID: " + id);
        }
    }

    @Override
    public Page<RoomResponse> getListRoom(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all) {
        try {
            log.info("start to get list room");
            Specification<Room> sortable= RSQLJPASupport.toSort(sort);
            Specification<Room>filterable= RSQLJPASupport.toSpecification(filter);
            Specification<Room>searchable= SearchHelper.buildSearchSpec(searchField,searchValue,SEARCH_FIELDS);
            Pageable pageable= all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
            return roomRepository.findAll(sortable.and(filterable).and(searchable),pageable).map(roomMapper::toResponse);
        }catch (Exception e){
            log.error("get list room error : {}",e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public void updateStatus(Long id, String status) {
        try {
            Room room = roomRepository.getReferenceById(id);
            try {
                room.setStatus(Enum.valueOf(RoomStatus.class, status.toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new ErrorHandler(HttpStatus.BAD_REQUEST, "Trạng thái không hợp lệ: " + status);
            }
            room.setUpdatedBy(String.valueOf(securityUtils.getCurrentUserId()));
            roomRepository.save(room);
            log.info("✅ Cập nhật trạng thái phòng (ID = {}) -> {}", id, room.getStatus());
        }catch (EntityNotFoundException e){
            log.warn("⚠️ Room with id {} not found: {}", id, e.getMessage());
            e.printStackTrace();
        }
    }
}
