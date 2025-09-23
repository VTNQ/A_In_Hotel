package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.MediaFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
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
