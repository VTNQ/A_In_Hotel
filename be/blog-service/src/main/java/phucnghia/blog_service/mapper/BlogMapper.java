package phucnghia.blog_service.mapper;

import org.springframework.stereotype.Component;
import phucnghia.blog_service.dto.BlogDTO;
import phucnghia.blog_service.dto.BlogResponse;
import phucnghia.blog_service.entity.Blog;
import phucnghia.blog_service.entity.MediaFile;
import phucnghia.blog_service.entity.Tag;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class BlogMapper {

    // dùng nếu bạn muốn gọi mapper ở nơi khác
    public Blog toEntity(BlogDTO dto) {
        Blog b = new Blog();
        b.setTitle(dto.getTitle());
        b.setContent(dto.getContent());
        b.setPublishAt(dto.getPublishAt());
        return b;
    }

    public BlogResponse toResponse(Blog blog) {
        BlogResponse res = new BlogResponse();
        res.setId(blog.getId());
        res.setTitle(blog.getTitle());
        res.setContent(blog.getContent());
        res.setCategoryName(blog.getCategory() != null ? blog.getCategory().getName() : null);

        res.setTags(blog.getTags() == null ? Collections.emptySet()
                : blog.getTags().stream().map(Tag::getName).collect(Collectors.toSet()));

        res.setMediaUrls(blog.getMediaFiles() == null ? Collections.emptyList()
                : blog.getMediaFiles().stream().map(MediaFile::getUrl).toList());

        res.setStatus(blog.getStatus());
        res.setPublishAt(blog.getPublishAt());
        return res;
    }
}
