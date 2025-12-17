package org.a_in_hotel.be.util;

import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.criteria.From;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.a_in_hotel.be.entity.Category;
import org.a_in_hotel.be.entity.Room;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.stream.Collectors;

public interface SearchHelper {
     static <T> Specification<T> parseSearchToken(String search, List<String> searchFields) {
        return search != null && !search.isBlank() && searchFields != null && !searchFields.isEmpty()
                ? (Specification)searchFields.stream()
                .map((field) -> field + "=like='" + search.trim() + "'")
                .collect(Collectors.collectingAndThen(Collectors.joining(","), RSQLJPASupport::toSpecification))
                : RSQLJPASupport.toSpecification((String)null);
    }
     static <T> Specification<T> parseSearchKeyValue(String searchField, String searchValue) {
        return searchField != null && !searchField.isBlank() && searchValue != null && !searchValue.isBlank()
                ? RSQLJPASupport.toSpecification(searchField + "=like='" + searchValue.trim() + "'")
                : RSQLJPASupport.toSpecification((String) null);
    }
     static <T> Specification<T> buildSearchSpec(String searchField, String searchValue, List<String> searchFields) {
        if (searchField == null || searchField.isBlank()) {
            return parseSearchToken(searchValue, searchFields);
        }
        return parseSearchKeyValue(searchField, searchValue);
    }
    static boolean needJoin(String filter, String searchField, String joinPrefix) {
        if (filter != null && filter.contains(joinPrefix + ".")) {
            return true;
        }
        return searchField != null && searchField.startsWith(joinPrefix + ".");
    }
    static <T> Specification<T> join(String joinPath){
         return (root,query,cb)->{
             query.distinct(true);
             From<?,?> from =root;
             for (String part : joinPath.split("\\.")){
                 from = from.join(part,JoinType.LEFT);
             }
             return  cb.conjunction();
         };
    }

    static <T> Specification<T> applyJoins(
            Specification<T> baseSpec,
            String filter,
            String searchField,
            String... joinPaths){
        Specification<T> spec = baseSpec;
        for (String joinPath : joinPaths) {
            if(needJoin(filter, searchField, joinPath)){
                spec = spec.and(join(joinPath));
            }
        }
        return spec;
    }
}
