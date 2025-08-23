package phucnghia.blog_service.service;

import phucnghia.blog_service.dto.BlogDTO;
import phucnghia.blog_service.dto.BlogResponse;

import java.util.List;

public interface BlogService {
    BlogResponse create(BlogDTO dto);
    BlogResponse update(Long id, BlogDTO dto);
    void delete(Long id);
    List<BlogResponse> findAll();
    BlogResponse findById(Long id);
}
