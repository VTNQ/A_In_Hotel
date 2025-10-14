package org.a_in_hotel.be.service;

import jakarta.servlet.http.HttpServletRequest;
import org.a_in_hotel.be.dto.request.RoomRequest;
import org.a_in_hotel.be.dto.response.RoomResponse;
import org.a_in_hotel.be.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RoomService {
    void save(RoomRequest request, List<MultipartFile>image,HttpServletRequest req);
    void update(Long id, RoomRequest request, List<MultipartFile>image, HttpServletRequest req);
    RoomResponse findById(Long id);
    Page<RoomResponse>getListRoom(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all);
}
