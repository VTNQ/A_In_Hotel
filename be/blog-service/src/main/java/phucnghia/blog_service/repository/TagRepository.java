package phucnghia.blog_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import phucnghia.blog_service.entity.Tag;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);
}
