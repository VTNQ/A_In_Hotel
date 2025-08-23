package phucnghia.blog_service.entity;

import jakarta.persistence.*;
import lombok.*;
import phucnghia.blog_service.Enum.BlogStatus;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.*;

@Entity
@Table(name = "blogs")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishAt; // dùng cho Schedule

    @Enumerated(EnumType.STRING)
    private BlogStatus status;

    // 1 Blog thuộc 1 Category
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // Blog có nhiều tag
    @ManyToMany
    @JoinTable(
            name = "blog_tags",
            joinColumns = @JoinColumn(name = "blog_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    // Blog có nhiều MediaFile
    @OneToMany(mappedBy = "blog", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MediaFile> mediaFiles = new ArrayList<>();
}
