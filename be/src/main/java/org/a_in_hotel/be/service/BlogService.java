package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.BlogRequest;
import org.a_in_hotel.be.dto.request.BlogUpdateRequest;
import org.a_in_hotel.be.dto.response.BlogResponse;
import org.a_in_hotel.be.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface BlogService {
    void save(BlogRequest request, MultipartFile file);

    void update(Long id, BlogUpdateRequest request, MultipartFile file);

    Page<BlogResponse> getAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all);

    void updateStatus(Long id,Integer status);

    BlogResponse getById(Long id);
}
