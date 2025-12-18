package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.BannerRequest;
import org.a_in_hotel.be.dto.response.BannerResponse;
import org.a_in_hotel.be.entity.Banner;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface BannerService {
    void save(BannerRequest bannerRequest, MultipartFile image);

    void update(Long id, BannerRequest bannerRequest, MultipartFile image);

    Page<BannerResponse> getListBanner(
            Integer page,
            Integer size,
            String sort,
            String filter,
            String searchField,
            String searchValue,
            boolean all);

    BannerResponse findById(Long id);

    void delete(Long id);
}
