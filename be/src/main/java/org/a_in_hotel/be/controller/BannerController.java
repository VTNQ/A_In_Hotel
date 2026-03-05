package org.a_in_hotel.be.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.annotation.ImageFile;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.BannerRequest;
import org.a_in_hotel.be.dto.request.BannerUpdateDTO;
import org.a_in_hotel.be.dto.response.BannerResponse;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.entity.Banner;
import org.a_in_hotel.be.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/banners")
@Tag(name = "banner")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class BannerController {

    private final BannerService bannerService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RequestResponse<Void>> create(@Valid @ModelAttribute BannerRequest bannerRequest) {
            bannerService.save(bannerRequest, bannerRequest.getImage());
            return ResponseEntity.ok(RequestResponse.success("Thêm banner thành công"));
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<RequestResponse<BannerResponse>> getBanner(@PathVariable Long id) {
            return ResponseEntity.ok(RequestResponse.success(bannerService.findById(id)));
    }

    @PutMapping(value = "/update/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RequestResponse<Void>> update(@PathVariable Long id, @Valid @ModelAttribute BannerUpdateDTO bannerRequest, @RequestParam(value = "image", required = false) MultipartFile image) {

            bannerService.update(id, bannerRequest, image);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật banner thành công"));
    }

    @GetMapping("/getAll")
    public ResponseEntity<RequestResponse<PageResponse<BannerResponse>>> getAll(@RequestParam(defaultValue = "1") int page,
                                                                        @RequestParam(defaultValue = "5") int size,
                                                                        @RequestParam(defaultValue = "id,desc") String sort,
                                                                        @RequestParam(required = false) String filter,
                                                                        @RequestParam(required = false) String searchField,
                                                                        @RequestParam(required = false) String searchValue,
                                                                        @RequestParam(required = false) boolean all) {
            PageResponse<BannerResponse> pageResponse =
                    new PageResponse<>(bannerService.getListBanner(page, size, sort, filter, searchField, searchValue, all));
            return ResponseEntity.ok(
                    RequestResponse.success(pageResponse, "Lấy banner thành công")
            );

    }
    @DeleteMapping("/{id}")
    public ResponseEntity<RequestResponse<Void>> delete(@PathVariable Long id) {
            bannerService.delete(id);
            return ResponseEntity.ok(
                    RequestResponse.success("Xóa banner thành công")
            );
    }
}
