package phucnghia.blog_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import phucnghia.blog_service.entity.Category;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
}
