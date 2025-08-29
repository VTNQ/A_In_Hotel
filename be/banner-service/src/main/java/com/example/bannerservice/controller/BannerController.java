package com.example.bannerservice.controller;

import com.example.bannerservice.dto.RequestResponse;
import com.example.bannerservice.dto.request.BannerRequest;
import com.example.bannerservice.dto.response.PageResponse;
import com.example.bannerservice.entity.Banner;
import com.example.bannerservice.service.BannerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/banners")
@Tag(name = "banner")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class BannerController {
    @Autowired
    private BannerService bannerService;

    @PostMapping(value = "/create",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RequestResponse<Void>> create(@ModelAttribute BannerRequest bannerRequest,@RequestParam(value = "image",required=false) MultipartFile image) {
        try {
            bannerService.save(bannerRequest,image);
            return ResponseEntity.ok(RequestResponse.success("Thêm banner thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<RequestResponse<Void>> update(@PathVariable Long id, @ModelAttribute BannerRequest bannerRequest,@RequestParam(value = "image",required=false) MultipartFile image) {
        try {
            bannerService.update(id, bannerRequest,image);
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
                                                                        @RequestParam(required = false) String search,
                                                                        @RequestParam(required = false) boolean all){
        try {
            PageResponse<Banner>pageResponse=
                    new PageResponse<>(bannerService.getListBanner(page, size, sort, filter, search, all));
            return ResponseEntity.ok(
                    RequestResponse.success(pageResponse,"Lấy banner thành công")
            );
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
}
