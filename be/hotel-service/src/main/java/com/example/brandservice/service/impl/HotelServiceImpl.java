package com.example.brandservice.service.impl;

import com.example.brandservice.Enum.HotelStatus;
import com.example.brandservice.client.AuthServiceClient;
import com.example.brandservice.dto.RequestResponse;
import com.example.brandservice.dto.request.HotelRequest;

import com.example.brandservice.entity.Hotel;
import com.example.brandservice.mapper.HotelMapper;
import com.example.brandservice.repository.HotelRepository;
import com.example.brandservice.service.HotelService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
public class HotelServiceImpl implements HotelService {
    @Autowired
    private HotelRepository hotelRepository;
    @Autowired
    private HotelMapper hotelMapper;
    @Autowired
    private AuthServiceClient authServiceClient;

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
    public void update(HotelRequest branch, Long id, String token) {
        try {
            Hotel entity = hotelRepository.getReferenceById(id);
            RequestResponse<Map<String, Object>> res = authServiceClient.isAdmin(branch.getIdUser(), token);
            Boolean isAdmin = (Boolean) res.getData().get("isAdmin");

            if (!Boolean.TRUE.equals(isAdmin)) {
                throw new RuntimeException("Bạn không có quyền ADMIN để tạo branch");
            }
            entity = hotelMapper.toEntity(branch);
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
}
