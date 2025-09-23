package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.TagDTO;
import org.springframework.data.domain.Page;


public interface TagService {
    TagDTO create(TagDTO dto);
    TagDTO update(Long id, TagDTO dto);
    void delete(Long id);
    TagDTO get(Long id);
    TagDTO getByName(String name);
    Page<TagDTO> search(String q, int page, int size, String sort);
}
