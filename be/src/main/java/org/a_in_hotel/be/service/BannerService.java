package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.BannerRequest;
import org.a_in_hotel.be.entity.Banner;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface BannerService {
    void save(BannerRequest bannerRequest, MultipartFile image);
    void update(Long id,BannerRequest bannerRequest,MultipartFile image);
    Page<Banner> getListBanner(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all);
    Banner findById(Long id);
}
