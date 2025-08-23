package phucnghia.blog_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import phucnghia.blog_service.entity.MediaFile;

@Repository
public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {}
