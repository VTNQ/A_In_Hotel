package phucnghia.blog_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "media_files")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MediaFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false)
    private String fileName;   // tên file trong DB

    @Column(name = "file_url", nullable = false)
    private String url;        // đường dẫn file

    private String type;       // image / video

    @ManyToOne
    @JoinColumn(name = "blog_id", nullable = false)
    private Blog blog;

    // constructor tiện dụng để tạo MediaFile từ URL
    public MediaFile(Long id, String url, String type, Blog blog) {
        this.id = id;
        this.url = url;
        this.type = type;
        this.blog = blog;
        this.fileName = extractFileName(url); // auto lấy tên file
    }

    private String extractFileName(String url) {
        return url.substring(url.lastIndexOf("/") + 1);
    }
}
