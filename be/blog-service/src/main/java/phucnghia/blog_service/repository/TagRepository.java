package phucnghia.blog_service.repository;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import phucnghia.blog_service.entity.Tag;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);

    @Query("select t from Tag t " +
            "where (:q is null or lower(t.name) like lower(concat('%', :q, '%')))")
    Page<Tag> search(String q, Pageable pageable);
}
