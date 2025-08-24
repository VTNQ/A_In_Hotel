package com.example.bannerservice.service;

import com.example.bannerservice.dto.request.CategoryRequest;
import com.example.bannerservice.entity.Category;
import org.springframework.data.domain.Page;

public interface CategoryService {
    void add(CategoryRequest categoryRequest);
    void update(CategoryRequest categoryRequest,Long id);
    Page<Category>getAll(int page, int size, String sort, String filter, String search, boolean all);
    Category findById(Long id);
}
