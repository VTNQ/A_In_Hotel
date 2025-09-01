package phucnghia.blog_service.repository;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import phucnghia.blog_service.entity.MediaFile;

import java.util.Optional;

@Repository
public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {
    Optional<MediaFile> findByFileName(String fileName);

    boolean existsByFileName(String fileName);

    @Query("select m from MediaFile m " +
            "where (:q is null or lower(m.fileName) like lower(concat('%', :q, '%')) " +
            "or lower(m.url) like lower(concat('%', :q, '%')) " +
            "or lower(m.contentType) like lower(concat('%', :q, '%')) " +
            "or lower(m.altText) like lower(concat('%', :q, '%')))")
    Page<MediaFile> search(String q, Pageable pageable);
}
