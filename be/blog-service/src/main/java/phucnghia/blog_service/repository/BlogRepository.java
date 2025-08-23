package phucnghia.blog_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import phucnghia.blog_service.entity.Blog;

public interface BlogRepository extends JpaRepository<Blog, Long> {}
