package phucnghia.blog_service.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import phucnghia.blog_service.dto.MediaFileDTO;
import phucnghia.blog_service.entity.MediaFile;
import phucnghia.blog_service.exception.NotFoundException;
import phucnghia.blog_service.mapper.MediaFileMapper;
import phucnghia.blog_service.repository.MediaFileRepository;
import phucnghia.blog_service.service.MediaFileService;

@Service
@RequiredArgsConstructor
@Transactional
public class MediaFileServiceImpl implements MediaFileService {

    private final MediaFileRepository repo;
    private final MediaFileMapper mapper;

    @Override
    public MediaFileDTO create(MediaFileDTO dto) {
        MediaFile entity = mapper.toEntity(dto);
        if (entity.getActive() == null) entity.setActive(true);
        return mapper.toDTO(repo.save(entity));
    }

    @Override
    public MediaFileDTO update(Long id, MediaFileDTO dto) {
        MediaFile entity = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("MediaFile not found: " + id));
        mapper.updateEntityFromDTO(dto, entity);
        return mapper.toDTO(repo.save(entity));
    }

    @Override
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new NotFoundException("MediaFile not found: " + id);
        repo.deleteById(id);
    }

    @Override
    public void softDelete(Long id) {
        MediaFile entity = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("MediaFile not found: " + id));
        entity.setActive(false);
        repo.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public MediaFileDTO get(Long id) {
        return repo.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new NotFoundException("MediaFile not found: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public MediaFileDTO getByFileName(String fileName) {
        return repo.findByFileName(fileName)
                .map(mapper::toDTO)
                .orElseThrow(() -> new NotFoundException("MediaFile not found, fileName=" + fileName));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MediaFileDTO> search(String q, int page, int size, String sort) {
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
