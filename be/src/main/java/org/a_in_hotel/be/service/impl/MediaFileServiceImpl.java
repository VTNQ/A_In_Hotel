package org.a_in_hotel.be.service.impl;

import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.request.MediaFileDTO;
import org.a_in_hotel.be.entity.MediaFile;
import org.a_in_hotel.be.exception.NotFoundException;
import org.a_in_hotel.be.mapper.MediaFileMapper;
import org.a_in_hotel.be.repository.MediaFileRepository;
import org.a_in_hotel.be.service.MediaFileService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
