package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.TagDTO;
import org.springframework.data.domain.Page;


public interface TagService {
    TagDTO create(TagDTO dto);

    TagDTO update(Long id, TagDTO dto);

    void delete(Long id);

    TagDTO get(Long id);

    Page<TagDTO> search(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all);
}
