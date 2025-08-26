package com.example.hotelservice.service.impl;

import com.example.commonutils.api.RequestResponse;
import com.example.hotelservice.Enum.HotelStatus;
import com.example.hotelservice.client.AuthServiceClient;
import com.example.hotelservice.client.UserServiceClient;
import com.example.hotelservice.dto.request.HotelRequest;

import com.example.hotelservice.dto.request.HotelUpdate;
import com.example.hotelservice.dto.response.HotelResponse;
import com.example.hotelservice.dto.response.User;
import com.example.hotelservice.entity.Hotel;
import com.example.hotelservice.mapper.HotelMapper;
import com.example.hotelservice.repository.HotelRepository;
import com.example.hotelservice.service.HotelService;
import com.example.hotelservice.util.SortHelper;
import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
public class HotelServiceImpl implements HotelService {
    @Autowired
    private HotelRepository hotelRepository;
    @Autowired
    private HotelMapper hotelMapper;
    @Autowired
    private AuthServiceClient authServiceClient;
    @Autowired
    private UserServiceClient userServiceClient;
    private static final Map<String, Comparator<HotelResponse>>SEARCH_FIELDS=Map.of(
            "name",Comparator.comparing(HotelResponse::getName),
            "fullName",Comparator.comparing(HotelResponse::getFullName),
            "code",Comparator.comparing(HotelResponse::getCode)
    );

    @Override
    public void save(HotelRequest hotel, String token) {
        try {
            log.info("save branch:{}", hotel);
            RequestResponse<Map<String, Object>> res = authServiceClient.isAdmin(hotel.getIdUser(), token);
            Boolean isAdmin = (Boolean) res.getData().get("isAdmin");

            if (!Boolean.TRUE.equals(isAdmin)) {
                throw new RuntimeException("Bạn không có quyền ADMIN để tạo branch");
            }

            Hotel hotelEntity = hotelMapper.toEntity(hotel);
            hotelRepository.save(hotelEntity);
        } catch (Exception e) {
            e.printStackTrace();
            log.warn("fail save branch:{}", e.getMessage());
            throw e;

        }
    }

    @Override
    public void update(HotelUpdate branch, Long id, String token) {
        try {
            Hotel entity = hotelRepository.getReferenceById(id);
            RequestResponse<Map<String, Object>> res = authServiceClient.isAdmin(branch.getIdUser(), token);
            Boolean isAdmin = (Boolean) res.getData().get("isAdmin");

            if (!Boolean.TRUE.equals(isAdmin)) {
                throw new RuntimeException("Bạn không có quyền ADMIN để tạo branch");
            }
            hotelMapper.updateEntityFromDto(branch, entity);
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
    public Page<HotelResponse> getAll(int page, int size, String sort, String filter, String search, boolean all) {
        try {
            List<Hotel>hotels=hotelRepository.findAll();
            if(hotels.isEmpty()){
                return Page.empty();
            }
            List<Long>userIds=hotels.stream()
                    .map(Hotel::getIdUser)
                    .filter(Objects::nonNull)
                    .distinct()
                    .collect(Collectors.toList());
            RequestResponse<List<User>> response = userServiceClient.getAll(userIds);
            List<User> users = response != null && response.getData() != null ? response.getData() : List.of();
            List<HotelResponse>dtos=hotelMapper.toResponse(hotels, users);
            java.util.function.Predicate<HotelResponse> predicate = dto -> true;
            if (filter != null && !filter.isBlank()) {
                predicate = predicate.and(SortHelper.parseDtoRsql(filter,SEARCH_FIELDS));
            }
            if (search != null && !search.isBlank()) {
                predicate = predicate.and(SortHelper.parseDtoRsql(search,SEARCH_FIELDS));
            }

            List<HotelResponse> filtered = dtos.stream()
                    .filter(predicate)
                    .toList();

            Comparator<HotelResponse> comparator = SortHelper.parseSort(sort,SEARCH_FIELDS);
            if (comparator != null) {
                filtered = filtered.stream().sorted(comparator).toList();
            }
            if (all) {
                return new PageImpl<>(filtered, Pageable.unpaged(), filtered.size());
            }
            int pageIndex = Math.max(0, page - 1);
            int from = Math.min(Math.max(0, pageIndex * size), filtered.size());
            int to = Math.min(from + size, filtered.size());
            List<HotelResponse> pageContent = filtered.subList(from, to);
            return new PageImpl<>(pageContent, PageRequest.of(pageIndex,size), filtered.size());
        }catch (Exception e){
            e.printStackTrace();
            log.warn("fail get hotel:{}", e.getMessage());
            return null;
        }
    }
}
