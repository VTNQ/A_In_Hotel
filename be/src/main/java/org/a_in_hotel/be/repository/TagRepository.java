package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);

    @Query("select t from Tag t " +
            "where (:q is null or lower(t.name) like lower(concat('%', :q, '%')))")
    Page<Tag> search(String q, Pageable pageable);
}
