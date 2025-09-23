package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.MediaFileDTO;
import org.springframework.data.domain.Page;

public interface MediaFileService {
    MediaFileDTO create(MediaFileDTO dto);
    MediaFileDTO update(Long id, MediaFileDTO dto);
    void delete(Long id);
    void softDelete(Long id);
    MediaFileDTO get(Long id);
    MediaFileDTO getByFileName(String fileName);
    Page<MediaFileDTO> search(String q, int page, int size, String sort);
}
