package org.a_in_hotel.be.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Entity
@Table(name = "system_contents",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_system_content_key", columnNames = "contentKey")
        })
@Data
@AllArgsConstructor
@NoArgsConstructor

public class SystemContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "content_key")
    private Integer contentKey;

    @Column(columnDefinition = "TEXT",name = "description")
    private String description;

    @Column(columnDefinition = "varchar(100)",name = "cta_text")
    private String ctaText;

    @Column(name = "is_active")
    private boolean isActive=true;

    @Transient
    private Image backgroundImage;

    @Column(name = "updated_by")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    private OffsetDateTime updatedBy;

    @Column(name = "updated_at")
    private String updatedAt;
}
