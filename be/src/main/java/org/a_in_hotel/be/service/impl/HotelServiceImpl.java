package org.a_in_hotel.be.service.impl;
import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.Enum.HotelStatus;
import org.a_in_hotel.be.dto.request.HotelRequest;
import org.a_in_hotel.be.dto.request.HotelUpdate;
import org.a_in_hotel.be.dto.response.HotelResponse;
import org.a_in_hotel.be.entity.Banner;
import org.a_in_hotel.be.entity.Hotel;
import org.a_in_hotel.be.mapper.HotelMapper;
import org.a_in_hotel.be.repository.HotelRepository;
import org.a_in_hotel.be.service.HotelService;
import org.a_in_hotel.be.util.GeneralService;
import org.a_in_hotel.be.util.SearchHelper;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


@Slf4j
@Service
public class HotelServiceImpl implements HotelService {
    private static final Map<String, String> FIELD_NAME_VI = Map.of(
            "code", "Mã khách sạn",
            "name", "Tên khách sạn",
            "email", "Email",
            "phone", "Số điện thoại"
    );

    @Autowired
    private HotelRepository hotelRepository;
    @Autowired
    private HotelMapper hotelMapper;
    @Autowired
    private GeneralService generalService;
    private static final List<String> SEARCH_FIELDS = List.of("name","code");

    @Override
    public void save(HotelRequest hotel) {
        try {
            log.info("save branch:{}", hotel);

            Hotel hotelEntity = hotelMapper.toEntity(hotel);
            hotelEntity.setCode(generalService.generateByUUID());
            hotelRepository.save(hotelEntity);
        } catch (DataIntegrityViolationException e) {
            String field = "unknown";
            if (e.getCause() instanceof ConstraintViolationException cve) {
                String constraint = cve.getConstraintName();
                if (constraint != null) {
                    // cắt theo dấu '.' rồi lấy phần cuối
                    String[] parts = constraint.split("\\.");
                    String rawField = parts[parts.length - 1];
                    field = FIELD_NAME_VI.getOrDefault(rawField, rawField);
                }
            }

            log.warn("Duplicate entry for field: {}", field);
            throw new IllegalArgumentException("Dữ liệu bị trùng ở trường: " + field, e);
        }catch (Exception e) {
            log.error("Unexpected error saving branch", e);
            throw e;
        }
    }

    @Override
    public void update(HotelUpdate branch, Long id) {
        try {
            Hotel entity = hotelRepository.getReferenceById(id);
            hotelMapper.updateEntity(branch, entity);
            hotelRepository.save(entity);
        }catch (EntityNotFoundException e){
          log.error("Hotel id={} không tồn tại",id,e);
          throw e;
        } catch (Exception e) {
            e.printStackTrace();
            log.warn("fail save branch:{}", e.getMessage());
            throw e;
        }
    }

    @Override
    public void updateStatus(HotelStatus branchStatus, Long id) {
        try {
            Hotel hotel = hotelRepository.getReferenceById(id);
            hotel.setStatus(branchStatus);
            hotelRepository.save(hotel);
        } catch (Exception e) {
            e.printStackTrace();
            log.warn("update status branch:{}", e.getMessage());
        }
    }

    @Override
    public Page<HotelResponse> getAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all) {
        try {
            log.info("start to get list hotel ");
            Specification<Hotel> sortable= RSQLJPASupport.toSort(sort);
            Specification<Hotel>filterable= RSQLJPASupport.toSpecification(filter);
            Specification<Hotel>searchable= SearchHelper.buildSearchSpec(searchField,searchValue,SEARCH_FIELDS);
            Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
            return hotelRepository.
                    findAll(sortable.and(filterable).and(searchable),pageable)
                    .map(hotelMapper::toResponse);
        }catch (Exception e){
            e.printStackTrace();
            log.error(e.getMessage());
            return null;
        }
    }
}
