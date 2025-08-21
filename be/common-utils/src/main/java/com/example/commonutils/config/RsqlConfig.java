package com.example.commonutils.config;

import io.github.perplexhub.rsql.RSQLCommonSupport;
import jakarta.persistence.EntityManager;
import org.springframework.context.annotation.Bean;

import java.util.Map;

public class RsqlConfig {
    @Bean
    public RSQLCommonSupport rsqlCommonSupport(EntityManager entityManager) {
        return new RSQLCommonSupport(Map.of("default", entityManager));
    }
}
