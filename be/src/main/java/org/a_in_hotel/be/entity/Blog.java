package org.a_in_hotel.be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.a_in_hotel.be.Enum.BlogStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
