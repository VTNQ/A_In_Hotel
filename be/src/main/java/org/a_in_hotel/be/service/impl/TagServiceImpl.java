package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.dto.request.TagDTO;
import org.a_in_hotel.be.entity.Tag;
import org.a_in_hotel.be.exception.NotFoundException;
import org.a_in_hotel.be.mapper.TagMapper;
import org.a_in_hotel.be.repository.TagRepository;
import org.a_in_hotel.be.service.TagService;
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


@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class TagServiceImpl implements TagService {

    private final TagRepository repo;
    private final TagMapper mapper;
    private final List<String> SEARCH_FIELDS = List.of("name");
    private final SecurityUtils securityUtils;
    @Override
    public TagDTO create(TagDTO dto) {
        Tag entity = mapper.toEntity(dto,securityUtils.getCurrentUserId());
        return mapper.toDTO(repo.save(entity));
    }

    @Override
    public TagDTO update(Long id, TagDTO dto) {
        Tag entity = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Tag not found: " + id));
        mapper.updateEntityFromDTO(dto, entity,securityUtils.getCurrentUserId());
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
    public Page<TagDTO> search(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all) {
        try {
            log.info("start to get List Tag");
            Specification<Tag> sortable= RSQLJPASupport.toSort(sort);
            Specification<Tag>filterable= RSQLJPASupport.toSpecification(filter);
            Specification<Tag>searchable= SearchHelper.buildSearchSpec(searchField,searchValue,SEARCH_FIELDS);
            Pageable pageable= all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
            return repo.findAll(sortable.and(filterable).and(searchable),pageable).map(mapper::toDTO);
        }catch (Exception e){
            log.error("get List Tag error:{}",e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}
