package org.a_in_hotel.be.service.impl;


import io.github.perplexhub.rsql.RSQLJPASupport;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.dto.request.CategoryDTO;
import org.a_in_hotel.be.entity.Category;
import org.a_in_hotel.be.exception.NotFoundException;
import org.a_in_hotel.be.mapper.CategoryMapper;
import org.a_in_hotel.be.repository.CategoryRepository;
import org.a_in_hotel.be.service.CategoryService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repo;
    private final CategoryMapper mapper;
    private static final List<String> SEARCH_FIELDS = List.of("name");
    private final SecurityUtils securityUtils;
    @Override
    public void create(CategoryDTO dto) {
        Category entity = mapper.toEntity(dto,securityUtils.getCurrentUserId());
        repo.save(entity);
    }

    @Override
    public void update(Long id, CategoryDTO dto) {
        Category entity = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found: " + id));
        mapper.updateEntityFromDTO(dto, entity,securityUtils.getCurrentUserId());
        repo.save(entity);
    }

    @Override
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new NotFoundException("Category not found: " + id);
        repo.deleteById(id);
    }

    @Override
    public void softDelete(Long id) {
        // chỉ dùng khi bạn thêm field active vào entity
        Category entity = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found: " + id));
        // entity.setActive(false); // cần thêm field active vào Category
        repo.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Category get(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found: " + id));
    }

    @Override
    public Page<Category> search(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all) {
        try {
            log.info("start to get list categories");
            Specification<Category>sortable= RSQLJPASupport.toSort(sort);
            Specification<Category>filterable= RSQLJPASupport.toSpecification(filter);
            Specification<Category>searchable= SearchHelper.buildSearchSpec(searchField,searchValue,SEARCH_FIELDS);
            Pageable pageable= all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
            return repo
                    .findAll(sortable.and(filterable).and(searchable),pageable);
        }catch (Exception e){
            e.printStackTrace();
            log.error(e.getMessage());
            return null;
        }
    }
}