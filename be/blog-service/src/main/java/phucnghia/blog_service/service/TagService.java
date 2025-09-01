package phucnghia.blog_service.service;

import org.springframework.data.domain.Page;
import phucnghia.blog_service.dto.TagDTO;

public interface TagService {
    TagDTO create(TagDTO dto);
    TagDTO update(Long id, TagDTO dto);
    void delete(Long id);
    TagDTO get(Long id);
    TagDTO getByName(String name);
    Page<TagDTO> search(String q, int page, int size, String sort);
}
