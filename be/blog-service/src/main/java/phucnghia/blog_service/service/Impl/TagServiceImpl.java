package phucnghia.blog_service.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import phucnghia.blog_service.dto.TagDTO;
import phucnghia.blog_service.entity.Tag;
import phucnghia.blog_service.exception.NotFoundException;
import phucnghia.blog_service.mapper.TagMapper;
import phucnghia.blog_service.repository.TagRepository;
import phucnghia.blog_service.service.TagService;

@Service
@RequiredArgsConstructor
@Transactional
public class TagServiceImpl implements TagService {

    private final TagRepository repo;
    private final TagMapper mapper;

    @Override
    public TagDTO create(TagDTO dto) {
        Tag entity = mapper.toEntity(dto);
        return mapper.toDTO(repo.save(entity));
    }

    @Override
    public TagDTO update(Long id, TagDTO dto) {
        Tag entity = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Tag not found: " + id));
        mapper.updateEntityFromDTO(dto, entity);
        return mapper.toDTO(repo.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new NotFoundException("Tag not found: " + id);
        repo.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public TagDTO get(Long id) {
        return repo.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Tag not found: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public TagDTO getByName(String name) {
        return repo.findByName(name)
                .map(mapper::toDTO)
                .orElseThrow(() -> new NotFoundException("Tag not found, name=" + name));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TagDTO> search(String q, int page, int size, String sort) {
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
