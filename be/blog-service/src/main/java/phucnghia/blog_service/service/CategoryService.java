package phucnghia.blog_service.service;


import org.springframework.data.domain.Page;
import phucnghia.blog_service.dto.CategoryDTO;

public interface CategoryService {
    CategoryDTO create(CategoryDTO dto);
    CategoryDTO update(Long id, CategoryDTO dto);
    void delete(Long id);            // hard delete
    void softDelete(Long id);        // nếu entity có cờ active
    CategoryDTO get(Long id);
    CategoryDTO getByName(String name);
    Page<CategoryDTO> search(String q, int page, int size, String sort);
}







