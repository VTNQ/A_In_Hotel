package com.example.bannerservice.util;

import io.github.perplexhub.rsql.RSQLJPASupport;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.stream.Collectors;

public  class SearchHelper {
   public static <T> Specification<T> parseSearchToken(String search, List<String> searchFields) {
        return search != null && !search.isBlank() && searchFields != null && !searchFields.isEmpty() ? (Specification)searchFields.stream().map((field) -> field + "=like='" + search.trim() + "'").collect(Collectors.collectingAndThen(Collectors.joining(","), RSQLJPASupport::toSpecification)) : RSQLJPASupport.toSpecification((String)null);
    }
}
