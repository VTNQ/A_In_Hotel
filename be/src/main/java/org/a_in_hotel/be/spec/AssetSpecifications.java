package org.a_in_hotel.be.spec;

import jakarta.persistence.criteria.Predicate;
import org.a_in_hotel.be.Enum.AssetStatus;
import org.a_in_hotel.be.entity.Asset;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class AssetSpecifications {

    public static Specification<Asset> filter(String keyword,
                                              AssetStatus status,
                                              Long categoryId,
                                              Long roomId) {
        return (root, query, cb) -> {
            var predicates = new java.util.ArrayList<Predicate>();

            if (StringUtils.hasText(keyword)) {
                String kw = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("assetCode")), kw),
                        cb.like(cb.lower(root.get("assetName")), kw)
                ));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (roomId != null) {
                predicates.add(cb.equal(root.get("room").get("id"), roomId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
