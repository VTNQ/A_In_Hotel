package com.example.bannerservice.service.impl;

import com.example.bannerservice.dto.request.CategoryRequest;
import com.example.bannerservice.entity.Category;
import com.example.bannerservice.mapper.CategoryMapper;
import com.example.bannerservice.repository.CategoryRepository;
import com.example.bannerservice.service.CategoryService;
import com.example.bannerservice.util.SearchHelper;
import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import io.github.perplexhub.rsql.RSQLJPASupport;
import java.util.List;

@Slf4j
@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private CategoryMapper categoryMapper;


    private static final List<String> SEARCH_FIELDS = List.of("name", "slug");

    @Override
    public void add(CategoryRequest categoryRequest) {
        try {
            log.info("start save category request");
            Category category = categoryMapper.toEntity(categoryRequest);
            categoryRepository.save(category);
            log.info("end save category request");
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
        }
    }

    @Override
    public void update(CategoryRequest categoryRequest, Long id) {
        try {
            log.info("start update category request");
            Category category = categoryRepository.getReferenceById(id);
            categoryMapper.toUpdate(categoryRequest, category);
            categoryRepository.save(category);
            log.info("end update category request");
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
        }
    }

    @Override
    public Page<Category> getAll(int page, int size, String sort, String filter, String search, boolean all) {
        try {
            log.info("start get all category request");
            Specification<Category> sortable = RSQLJPASupport.toSort(sort);
            Specification<Category> filterable = RSQLJPASupport.toSpecification(filter);
            Specification<Category> searchable = SearchHelper.parseSearchToken(search, SEARCH_FIELDS);
            Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
            Page<Category> responses = categoryRepository
                    .findAll(sortable.and(filterable).and(searchable), pageable);
            return responses;
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return null;
        }
    }

    @Override
    public Category findById(Long id) {
        try {
            log.info("start find category request");
            Category category = categoryRepository.getReferenceById(id);
            return category;
        }catch (EntityNotFoundException e) {
            log.error("Category not found with id={}", id, e);
            throw new RuntimeException("Category not found with id=" + id, e);
        }catch (Exception e){
            e.printStackTrace();
            log.error("error get by id:{}",id,e.getMessage());
            return null;
        }
    }
}
