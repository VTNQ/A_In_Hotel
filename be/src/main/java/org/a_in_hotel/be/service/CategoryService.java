package org.a_in_hotel.be.service;


import org.a_in_hotel.be.dto.request.CategoryDTO;
import org.a_in_hotel.be.entity.Category;
import org.springframework.data.domain.Page;
public interface CategoryService {
    void create(CategoryDTO dto);
    void update(Long id, CategoryDTO dto);
    void delete(Long id);            // hard delete
    void softDelete(Long id);        // nếu entity có cờ active
    Category get(Long id);
    Category getByName(String name);
    Page<Category> search(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all);
}







