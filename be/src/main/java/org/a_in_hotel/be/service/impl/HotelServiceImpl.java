package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.Enum.HotelStatus;
import org.a_in_hotel.be.dto.request.HotelHotlineRequest;
import org.a_in_hotel.be.dto.request.HotelRequest;
import org.a_in_hotel.be.dto.request.HotelUpdate;
import org.a_in_hotel.be.dto.response.FacilityResponse;
import org.a_in_hotel.be.dto.response.FileUploadMeta;
import org.a_in_hotel.be.dto.response.HotelResponse;
import org.a_in_hotel.be.dto.response.ImageResponse;
import org.a_in_hotel.be.entity.*;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.mapper.HotelHotlineMapper;
import org.a_in_hotel.be.mapper.HotelMapper;
import org.a_in_hotel.be.mapper.ImageMapper;
import org.a_in_hotel.be.repository.*;
import org.a_in_hotel.be.service.HotelService;
import org.a_in_hotel.be.util.EmailService;
import org.a_in_hotel.be.util.GeneralService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService {

    private static final Map<String, String> FIELD_NAME_VI = Map.of(
            "uk_hotels_account", "Người quản lý (Account)",
            "uk_hotels_code", "Mã khách sạn",
            "uk_hotels_name", "Tên khách sạn"
    );

    private final HotelRepository hotelRepository;
    private final EmailService emailService;
    private final HotelHotlineMapper mapper;
    private final AccountRepository accountRepository;
    private final AssetRepository assetRepository;
    private final ExtraServiceRepository extraServiceRepository;
    private final StaffRepository staffRepository;
    private final SecurityUtils securityUtils;
    private final HotelMapper hotelMapper;
    private final ImageRepository imageRepository;
    private final GeneralService generalService;
    private final ImageMapper imageMapper;
    private static final List<String> SEARCH_FIELDS = List.of("name", "code");

    @Override
    public void save(HotelRequest hotel, MultipartFile file) {
        try {
            log.info("Saving hotel: {}", hotel);


            hotelRepository.findByAccount_Id(hotel.getIdUser()) // giả sử HotelRequest có idUser = accountId
                    .ifPresent(existingHotel -> {
                        String ownerName = staffRepository.findByAccountId(existingHotel.getAccount().getId())
                                .map(Staff::getFullName)
                                .orElse(existingHotel.getAccount().getEmail());

                        String msg = String.format(
                                "Tạo khách sạn thất bại. Account %s đã quản lý khách sạn %s",
                                ownerName, existingHotel.getName()
                        );
                        log.warn(msg);
                        throw new IllegalArgumentException(msg);
                    });

            Hotel hotelEntity = hotelMapper.toEntity(hotel, securityUtils.getCurrentUserId());

            hotelRepository.save(hotelEntity);
            Account account = accountRepository.findById(hotel.getIdUser())
                    .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + hotel.getIdUser()));
            account.setHotel(hotelEntity);
            accountRepository.save(account);
            createHotelHotline(hotelEntity,hotel.getHotlines());
            if (file != null && !file.isEmpty()) {
                try {
                    FileUploadMeta fileUploadMeta = generalService.saveFile(file, "hotel");
                    Image hotelImage = imageMapper.toBannerImage(fileUploadMeta);
                    hotelImage.setEntityType("hotel");
                    hotelImage.setEntityId(hotelEntity.getId());
                    imageRepository.save(hotelImage);
                } catch (Exception e) {
                    throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR,
                            "Lỗi khi lưu hình ảnh :" + e.getMessage());
                }
            }
            sendAdminAssignmentEmail(hotelEntity);
            log.info("Hotel created successfully by {}", securityUtils.getCurrentUserEmail());
        } catch (DataIntegrityViolationException e) {
            String field = resolveConstraintField(e);
            log.warn("Duplicate entry on field: {}", field);
            throw new IllegalArgumentException("Tạo khách sạn thất bại. Dữ liệu bị trùng ở trường: " + field, e);
        } catch (Exception e) {
            log.error("Unexpected error saving hotel", e);
            throw e;
        }
    }
    private void createHotelHotline(Hotel hotel, List<HotelHotlineRequest> requests){
        if(requests == null || requests.isEmpty()){
            return;
        }
        List<HotelHotline> list = new ArrayList<>();
        for (HotelHotlineRequest request : requests){
            HotelHotline hotelHotline = mapper.toEntity(request);
            hotelHotline.setHotel(hotel);
            list.add(hotelHotline);
        }
        hotel.setHotlines(list);
    }
    private void sendAdminAssignmentEmail(Hotel hotel) {
        Account adminAccount = hotel.getAccount();
        if (adminAccount == null) {
            log.warn("Hotel {} has no admin account assigned", hotel.getName());
            return;
        }

        String email = adminAccount.getEmail();
        String fullName = staffRepository.findByAccountId(adminAccount.getId())
                .map(Staff::getFullName)
                .orElse("Admin");

        try {
            emailService.sendHotelAdminAssignmentEmail(
                    email,
                    fullName,
                    hotel.getName()
            );
        } catch (Exception e) {
            log.error("Failed to send admin assignment email", e);
        }
    }

    @Override
    public void update(HotelUpdate hotel, Long id, MultipartFile file) {
        try {
            Hotel currentHotel = hotelRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Hotel id=" + id + " không tồn tại"));

            Long newAccountId = hotel.getIdUser();
            Long oldAccountId = currentHotel.getAccount() != null
                    ? currentHotel.getAccount().getId()
                    : null;

            hotelMapper.updateEntity(
                    hotel,
                    currentHotel,
                    securityUtils.getCurrentUserId()
            );

            if (newAccountId != null && !newAccountId.equals(oldAccountId)) {
                hotelRepository.findByAccount_Id(newAccountId)
                        .ifPresent(otherHotel -> {
                            if (!otherHotel.getId().equals(currentHotel.getId())) {
                                log.warn(
                                        "Account {} đang quản lý hotel {} → gỡ khỏi hotel cũ",
                                        newAccountId,
                                        otherHotel.getName()
                                );
                                otherHotel.setAccount(null);
                                otherHotel.setUpdatedBy(
                                        securityUtils.getCurrentUserId().toString()
                                );
                                hotelRepository.save(otherHotel);
                            }
                        });
                Account newAccount = accountRepository.getReferenceById(newAccountId);
                currentHotel.setAccount(newAccount);
            }
            if (file != null && !file.isEmpty()) {

                Image oldImage = imageRepository
                        .findFirstByEntityIdAndEntityType(
                                currentHotel.getId(),
                                "hotel"
                        )
                        .orElse(null);

                // Xóa ảnh cũ
                if (oldImage != null) {
                    try {
                        generalService.deleFile(oldImage.getUrl());
                    } catch (Exception e) {
                        log.warn(
                                "⚠️ Không thể xóa ảnh cũ {}: {}",
                                oldImage.getUrl(),
                                e.getMessage()
                        );
                    }
                    imageRepository.delete(oldImage);
                }

                // Upload ảnh mới
                FileUploadMeta meta;
                try {
                    meta = generalService.saveFile(file, "hotel");
                } catch (IOException e) {
                    throw new ErrorHandler(
                            HttpStatus.INTERNAL_SERVER_ERROR,
                            "Lỗi upload file: " + e.getMessage()
                    );
                }
                Image newImage = imageMapper.toBannerImage(meta);
                newImage.setEntityType("hotel");
                newImage.setEntityId(currentHotel.getId());
                imageRepository.save(newImage);
            }


            updateHotline(currentHotel,hotel);

            hotelRepository.save(currentHotel);
            sendAdminAssignmentEmail(currentHotel);

            log.info(
                    "Hotel {} updated successfully by {}",
                    currentHotel.getId(),
                    securityUtils.getCurrentUserEmail()
            );
        } catch (DataIntegrityViolationException e) {
            String field = resolveConstraintField(e);
            log.warn("Duplicate entry on field: {}", field);
            throw new IllegalArgumentException("Dữ liệu bị trùng ở trường: " + field, e);

        } catch (EntityNotFoundException e) {
            log.error("Hotel id={} không tồn tại", id, e);
            throw e;

        } catch (Exception e) {
            log.error("Unexpected error updating hotel id={}", id, e);
            throw e;
        }
    }

    private void updateHotline(Hotel currentHotel,HotelUpdate request){

        if (request.getHotlines() == null) return;

        if (currentHotel.getId() == null) {
            throw new IllegalStateException("Hotel must be saved before updating hotlines");
        }
            Set<String> requestPhones = request.getHotlines()
                    .stream()
                    .map(HotelHotlineRequest::getPhone)
                    .collect(Collectors.toSet());
            currentHotel.getHotlines()
                    .removeIf(h->!requestPhones.contains(h.getPhone()));
            Set<String> existingPhones = currentHotel.getHotlines()
                    .stream()
                    .map(HotelHotline::getPhone)
                    .collect(Collectors.toSet());
            request.getHotlines().stream()
                    .map(HotelHotlineRequest::getPhone)
                    .filter(phone->!existingPhones.contains(phone))
                    .forEach(phone->{
                        HotelHotline hotline = new HotelHotline();
                        hotline.setPhone(phone);
                        hotline.setHotel(currentHotel);
                        currentHotel.getHotlines().add(hotline);
                    });

    }

    @Override
    public void updateStatus(Integer branchStatus, Long id) {
        try {
            Hotel hotel = hotelRepository.getReferenceById(id);
            hotel.setStatus(branchStatus);
            hotelRepository.save(hotel);
        } catch (Exception e) {
            log.error("Failed to update status for hotel id={}", id, e);
            throw e;
        }
    }

    @Override
    public Page<HotelResponse> getAll(Integer page, Integer size, String sort, String filter,
                                      String searchField, String searchValue, boolean all) {
        try {
            log.info("Fetching list of hotels");
            Specification<Hotel> sortable = RSQLJPASupport.toSort(sort);
            Specification<Hotel> filterable = RSQLJPASupport.toSpecification(filter);
            Specification<Hotel> searchable = SearchHelper.buildSearchSpec(searchField, searchValue, SEARCH_FIELDS);

            Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
            Page<Hotel> hotels = hotelRepository.findAll(
                    sortable
                            .and(filterable)
                            .and(searchable.and(filterable)),
                    pageable
            );
            return hotels.map(hotel -> hotelMapper.toResponse(hotel,
                    staffRepository,
                    imageRepository));
        } catch (Exception e) {
            log.error("Failed to fetch hotels", e);
            throw e;
        }
    }

    @Override
    public Hotel getHotelByAccountId(Long accountId) {
        return hotelRepository.findByAccount_Id(accountId).orElse(null);
    }

    @Override
    public HotelResponse getHotelById(Long id) {
        return hotelRepository.findById(id)
                .map(hotel -> hotelMapper.toResponse(hotel, staffRepository, imageRepository))
                .orElseThrow(() -> new IllegalArgumentException("Hotel not found"));
    }

    /**
     * Map constraint name từ DB sang field tiếng Việt
     */
    private String resolveConstraintField(DataIntegrityViolationException e) {
        if (e.getCause() instanceof ConstraintViolationException cve) {
            String constraint = cve.getConstraintName();
            if (constraint != null) {
                // chỉ lấy phần cuối (sau dấu '.')
                String[] parts = constraint.split("\\.");
                String rawConstraint = parts[parts.length - 1];
                return FIELD_NAME_VI.getOrDefault(rawConstraint, rawConstraint);
            }
        }
        return "Trường dữ liệu";
    }


}
