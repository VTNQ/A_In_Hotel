package com.example.commonsecurity.config;

import io.github.perplexhub.rsql.RSQLCommonSupport;
import jakarta.persistence.EntityManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
@Configuration
public class RsqlConfig {
    @Bean
    public RSQLCommonSupport rsqlCommonSupport(EntityManager entityManager) {
        return new RSQLCommonSupport(Map.of("default", entityManager));
    }
}
