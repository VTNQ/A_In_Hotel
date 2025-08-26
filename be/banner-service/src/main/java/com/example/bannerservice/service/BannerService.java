package com.example.bannerservice.service;

import com.example.bannerservice.dto.request.BannerRequest;
import com.example.bannerservice.entity.Banner;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface BannerService {
    void save(BannerRequest bannerRequest, MultipartFile image);
    void update(Long id,BannerRequest bannerRequest,MultipartFile image);
    Page<Banner>getListBanner(Integer page, Integer size, String sort, String filter, String search, boolean all);
}
