package phucnghia.blog_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "media_files")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false)
    private String fileName;   // tên file trong DB

    @Column(name = "file_url", nullable = false)
    private String url;        // đường dẫn file

    @Column(name = "content_type", length = 120)
    private String contentType; // ví dụ: image/png, video/mp4

    private Long sizeBytes;    // kích thước file

    private String altText;    // mô tả ảnh (SEO)

    @Column(nullable = false)
    private Boolean active = true; // để soft delete

    @ManyToOne
    @JoinColumn(name = "blog_id", nullable = false)
    private Blog blog;
}
