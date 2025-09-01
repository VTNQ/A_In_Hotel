package phucnghia.blog_service.service.Impl;


import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import phucnghia.blog_service.dto.CategoryDTO;
import phucnghia.blog_service.entity.Category;
import phucnghia.blog_service.mapper.CategoryMapper;
import phucnghia.blog_service.repository.CategoryRepository;
import phucnghia.blog_service.service.CategoryService;


@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repo;
    private final CategoryMapper mapper;

    @Override
    public CategoryDTO create(CategoryDTO dto) {
        Category entity = mapper.toEntity(dto);
        return mapper.toDTO(repo.save(entity));
    }

    @Override
    public CategoryDTO update(Long id, CategoryDTO dto) {
        Category entity = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found: " + id));
        mapper.updateEntityFromDTO(dto, entity);
        return mapper.toDTO(repo.save(entity));
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
    public CategoryDTO get(Long id) {
        return repo.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Category not found: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDTO getByName(String name) {
        return repo.findByName(name)
                .map(mapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Category not found, name=" + name));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CategoryDTO> search(String q, int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, parseSort(sort, "id,desc"));
        return repo.search((q == null || q.isBlank()) ? null : q.trim(), pageable)
                .map(mapper::toDTO);
    }

    private Sort parseSort(String sort, String fallback) {
        String s = (sort == null || sort.isBlank()) ? fallback : sort;
        String[] p = s.split(",");
        return Sort.by(Sort.Direction.fromString(p.length > 1 ? p[1] : "asc"), p[0]);
    }
}