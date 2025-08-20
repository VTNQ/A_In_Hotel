package com.example.systemconfigservice.service.impl;

import com.example.systemconfigservice.dto.request.SystemConfigRequest;
import com.example.systemconfigservice.entity.SystemConfig;
import com.example.systemconfigservice.mapper.SystemConfigMapper;
import com.example.systemconfigservice.repository.SystemConfigRepository;
import com.example.systemconfigservice.service.SystemConfigService;
import com.example.systemconfigservice.util.SortHelper;
import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;

import io.github.perplexhub.rsql.RSQLJPASupport;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SystemConfigServiceImpl implements SystemConfigService {
    @Autowired
    private SystemConfigRepository systemConfigRepository;
    @Autowired
    private SystemConfigMapper systemConfigMapper;
    @Autowired
    private EntityManager em;
    @Override
    public void save(SystemConfigRequest request) {
        try {
            log.info("save system config:{}", request);
            SystemConfig systemConfig = systemConfigMapper.toEntity(request);
            systemConfigRepository.save(systemConfig);
            log.info("save system config success:{}", systemConfig);
        } catch (Exception e) {
            e.printStackTrace();
            log.warn("save system config error:{}", e.getMessage());
            throw e;
        }
    }

    @Override
    public void update(Long id, SystemConfigRequest request) {
        try {
            log.info("update system config:{}", request);
            SystemConfig entity = systemConfigRepository.getReferenceById(id);
            entity = systemConfigMapper.toEntity(request);
            systemConfigRepository.save(entity);
            log.info("update system config success:{}", entity);
        } catch (Exception e) {
            e.printStackTrace();
            log.warn("update system config error:{}", e.getMessage());
            throw e;
        }
    }

    @Override
    public void delete(Long id) {
        try {
            systemConfigRepository.deleteById(id);
            log.info("delete system config success:{}", id);
        } catch (Exception e) {
            log.warn("delete system config error:{}", e.getMessage());
            throw e;
        }
    }

    @Override
    public Page<SystemConfig> getAll(int page, int size, String sort, String filter, String search, boolean all) {
        try {
            page = Math.max(page, 1);
            size = Math.min(Math.max(size, 1), 200);

            Specification<SystemConfig> specs = Specification.where(null);
            if (filter != null && !filter.isBlank()) {
                specs = specs.and(RSQLJPASupport.<SystemConfig>toSpecification(filter));
            }
            if (search != null && !search.isBlank()) {
                specs = specs.and(RSQLJPASupport.<SystemConfig>toSpecification(search));
            }

            Pageable pageable = all
                    ? Pageable.unpaged()
                    : PageRequest.of(page - 1, size, SortHelper.parseSort(sort));

            return systemConfigRepository.findAll(specs, pageable);
        } catch (Exception e) {
            log.warn("get system config error:{}", e.getMessage());
            throw e;
        }
    }
}
