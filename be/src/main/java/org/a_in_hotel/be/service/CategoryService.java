package org.a_in_hotel.be.service;


import org.a_in_hotel.be.dto.request.CategoryDTO;
import org.springframework.data.domain.Page;
public interface CategoryService {
    CategoryDTO create(CategoryDTO dto);
    CategoryDTO update(Long id, CategoryDTO dto);
    void delete(Long id);            // hard delete
    void softDelete(Long id);        // nếu entity có cờ active
    CategoryDTO get(Long id);
    CategoryDTO getByName(String name);
    Page<CategoryDTO> search(String q, int page, int size, String sort);
}







