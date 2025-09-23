package org.a_in_hotel.be.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.BannerRequest;
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
    @Autowired
    private BannerService bannerService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RequestResponse<Void>> create(@Valid @ModelAttribute BannerRequest bannerRequest, BindingResult bindingResult, @RequestParam(value = "image", required = false) MultipartFile image) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Dữ liệu không hợp lệ");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RequestResponse.error(errorMessage));
        }
        try {
            bannerService.save(bannerRequest, image);
            return ResponseEntity.ok(RequestResponse.success("Thêm banner thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<RequestResponse<Banner>> getBanner(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(RequestResponse.success(bannerService.findById(id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<RequestResponse<Void>> update(@PathVariable Long id, @Valid @ModelAttribute BannerRequest bannerRequest, BindingResult bindingResult, @RequestParam(value = "image", required = false) MultipartFile image) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Dữ liệu không hợp lệ");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RequestResponse.error(errorMessage));
        }
        try {
            bannerService.update(id, bannerRequest, image);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật banner thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<RequestResponse<PageResponse<Banner>>> getAll(@RequestParam(defaultValue = "1") int page,
                                                                        @RequestParam(defaultValue = "5") int size,
                                                                        @RequestParam(defaultValue = "id,desc") String sort,
                                                                        @RequestParam(required = false) String filter,
                                                                        @RequestParam(required = false) String searchField,
                                                                        @RequestParam(required = false) String searchValue,
                                                                        @RequestParam(required = false) boolean all) {
        try {
            PageResponse<Banner> pageResponse =
                    new PageResponse<>(bannerService.getListBanner(page, size, sort, filter, searchField, searchValue, all));
            return ResponseEntity.ok(
                    RequestResponse.success(pageResponse, "Lấy banner thành công")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
}
