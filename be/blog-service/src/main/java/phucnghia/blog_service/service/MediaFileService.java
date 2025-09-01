package phucnghia.blog_service.service;

import org.springframework.data.domain.Page;
import phucnghia.blog_service.dto.MediaFileDTO;

public interface MediaFileService {
    MediaFileDTO create(MediaFileDTO dto);
    MediaFileDTO update(Long id, MediaFileDTO dto);
    void delete(Long id);
    void softDelete(Long id);
    MediaFileDTO get(Long id);
    MediaFileDTO getByFileName(String fileName);
    Page<MediaFileDTO> search(String q, int page, int size, String sort);
}
