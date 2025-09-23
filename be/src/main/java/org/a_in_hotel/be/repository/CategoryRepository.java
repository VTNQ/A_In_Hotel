package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);

    @Query("select c from Category c " +
            "where (:q is null or lower(c.name) like lower(concat('%', :q, '%')))")
    Page<Category> search(String q, Pageable pageable);

}
