package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.BlogDTO;
import org.a_in_hotel.be.dto.response.BlogResponse;
import org.a_in_hotel.be.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BlogService {
    void create(BlogDTO dto, MultipartFile file);
    void update(Long id, BlogDTO dto,MultipartFile file);
    void delete(Long id);
    Page<Blog> findAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all);
    Blog findById(Long id);
}
