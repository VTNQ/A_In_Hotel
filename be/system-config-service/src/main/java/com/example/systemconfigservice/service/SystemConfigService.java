package com.example.systemconfigservice.service;

import com.example.systemconfigservice.dto.request.SystemConfigRequest;
import com.example.systemconfigservice.entity.SystemConfig;
import org.springframework.data.domain.Page;


public interface SystemConfigService {
    void save(SystemConfigRequest request);
    void update(Long id,SystemConfigRequest request);
    void delete(Long id);
    Page<SystemConfig> getAll(int page, int size, String sort, String filter, String search, boolean all);
}
