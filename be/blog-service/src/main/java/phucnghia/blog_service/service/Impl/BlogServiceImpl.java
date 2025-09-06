package phucnghia.blog_service.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import phucnghia.blog_service.Enum.BlogStatus;
import phucnghia.blog_service.dto.BlogDTO;
import phucnghia.blog_service.dto.BlogResponse;
import phucnghia.blog_service.entity.Blog;
import phucnghia.blog_service.entity.Category;
import phucnghia.blog_service.entity.MediaFile;
import phucnghia.blog_service.entity.Tag;
import phucnghia.blog_service.exception.BlogNotFoundException;
import phucnghia.blog_service.mapper.BlogMapper;
import phucnghia.blog_service.repository.BlogRepository;
import phucnghia.blog_service.repository.CategoryRepository;
import phucnghia.blog_service.repository.TagRepository;
import phucnghia.blog_service.service.BlogService;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final BlogMapper blogMapper;

    @Override
    public BlogResponse create(BlogDTO dto) {
        if (dto.getCategoryId() == null) {
            throw new IllegalArgumentException("categoryId is required");
        }

        Blog blog = new Blog();
        blog.setTitle(dto.getTitle());
        blog.setContent(dto.getContent());
        blog.setCreatedAt(LocalDateTime.now());
        blog.setUpdatedAt(LocalDateTime.now());

        // Category
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + dto.getCategoryId()));
        blog.setCategory(category);

        // Tags (null-safe)
        Set<Tag> tags = (dto.getTags() == null ? Collections.<String>emptySet() : Set.copyOf(dto.getTags()))
                .stream()
                .filter(name -> name != null && !name.isBlank())
                .map(name -> tagRepository.findByName(name.trim())
                        .orElseGet(() -> tagRepository.save(new Tag(null, name.trim()))))
                .collect(Collectors.toSet());
        blog.setTags(tags);

        // Media (null-safe)
        List<MediaFile> mediaFiles = (dto.getMediaUrls() == null ? Collections.<String>emptyList() : dto.getMediaUrls())
                .stream()
                .filter(url -> url != null && !url.isBlank())
                .map(url -> MediaFile.builder()
                        .fileName(extractFileName(url))
                        .url(url.trim())
                        .contentType(detectType(url))
                        .sizeBytes(null)      // nếu FE gửi size thì set vào
                        .altText(null)        // nếu FE gửi altText thì set vào
                        .active(true)
                        .blog(blog)
                        .build())
                .toList();
        blog.setMediaFiles(mediaFiles);

        // Lịch đăng
        if (dto.getPublishAt() != null && dto.getPublishAt().isAfter(LocalDateTime.now())) {
            blog.setStatus(BlogStatus.SCHEDULED);
            blog.setPublishAt(dto.getPublishAt());
        } else {
            blog.setStatus(BlogStatus.DRAFT);
            blog.setPublishAt(null);
        }

        return blogMapper.toResponse(blogRepository.save(blog));
    }

    @Override
    public BlogResponse update(Long id, BlogDTO dto) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new BlogNotFoundException(id));

        blog.setTitle(dto.getTitle());
        blog.setContent(dto.getContent());
        blog.setUpdatedAt(LocalDateTime.now());

        // Category (chỉ cập nhật khi FE gửi)
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found: " + dto.getCategoryId()));
            blog.setCategory(category);
        }

        // Tags (chỉ cập nhật khi FE gửi)
        if (dto.getTags() != null) {
            Set<Tag> tags = dto.getTags().stream()
                    .filter(name -> name != null && !name.isBlank())
                    .map(name -> tagRepository.findByName(name.trim())
                            .orElseGet(() -> tagRepository.save(new Tag(null, name.trim()))))
                    .collect(Collectors.toSet());
            blog.setTags(tags);
        }

        // Media (chỉ cập nhật khi FE gửi)
        if (dto.getMediaUrls() != null) {
            blog.getMediaFiles().clear(); // orphanRemoval xóa media cũ
            List<MediaFile> newMedias = dto.getMediaUrls().stream()
                    .filter(url -> url != null && !url.isBlank())
                    .map(url -> MediaFile.builder()
                            .fileName(extractFileName(url))
                            .url(url.trim())
                            .contentType(detectType(url))
                            .sizeBytes(null)
                            .altText(null)
                            .active(true)
                            .blog(blog)
                            .build())
                    .toList();
            blog.getMediaFiles().addAll(newMedias);
        }

        // Lịch đăng (chỉ cập nhật khi FE gửi)
        if (dto.getPublishAt() != null) {
            if (dto.getPublishAt().isAfter(LocalDateTime.now())) {
                blog.setStatus(BlogStatus.SCHEDULED);
                blog.setPublishAt(dto.getPublishAt());
            } else {
                blog.setStatus(BlogStatus.DRAFT);
                blog.setPublishAt(null);
            }
        }

        return blogMapper.toResponse(blogRepository.save(blog));
    }

    @Override
    public void delete(Long id) {
        if (!blogRepository.existsById(id)) throw new BlogNotFoundException(id);
        blogRepository.deleteById(id);
    }

    @Override
    public List<BlogResponse> findAll() {
        return blogRepository.findAll().stream().map(blogMapper::toResponse).toList();
    }

    @Override
    public BlogResponse findById(Long id) {
        return blogRepository.findById(id)
                .map(blogMapper::toResponse)
                .orElseThrow(() -> new BlogNotFoundException(id));
    }

    // helper
    private String detectType(String url) {
        String u = url.toLowerCase();
        if (u.endsWith(".mp4") || u.endsWith(".mov") || u.contains("youtube") || u.contains("vimeo")) {
            return "video/mp4";
        }
        if (u.endsWith(".png")) return "image/png";
        if (u.endsWith(".jpg") || u.endsWith(".jpeg")) return "image/jpeg";
        if (u.endsWith(".gif")) return "image/gif";
        return "application/octet-stream";
    }

    private String extractFileName(String url) {
        try {
            return url.substring(url.lastIndexOf('/') + 1);
        } catch (Exception e) {
            return url; // fallback nếu không parse được
        }
    }
}
