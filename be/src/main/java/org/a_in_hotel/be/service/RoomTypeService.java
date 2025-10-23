package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.RoomTypeRequest;
import org.a_in_hotel.be.entity.RoomType;
import org.springframework.data.domain.Page;

public interface RoomTypeService {
    void save(RoomTypeRequest request);

    void update(Long id, RoomTypeRequest request);

    Page<RoomType> getAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all);

    RoomType getById(Long id);

    void updateStatus(Long id, boolean status);
}
