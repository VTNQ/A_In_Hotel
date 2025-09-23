package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.BlogDTO;
import org.a_in_hotel.be.dto.response.BlogResponse;

import java.util.List;

public interface BlogService {
    BlogResponse create(BlogDTO dto);
    BlogResponse update(Long id, BlogDTO dto);
    void delete(Long id);
    List<BlogResponse> findAll();
    BlogResponse findById(Long id);
}
