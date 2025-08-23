package com.example.systemconfigservice.repository;

import com.example.systemconfigservice.entity.SystemConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SystemConfigRepository extends JpaRepository<SystemConfig,Long>, JpaSpecificationExecutor<SystemConfig> {
    Optional<SystemConfig>findBykey(String key);
}
