package org.a_in_hotel.be.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.BlogDTO;
import org.a_in_hotel.be.dto.response.BlogResponse;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.entity.Blog;
import org.a_in_hotel.be.service.BlogService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@Tag(name = "blog")
@RequiredArgsConstructor
public class BlogController {
    private final BlogService blogService;

    @GetMapping
    @Operation(summary = "Lấy danh sách blog")
    public ResponseEntity<RequestResponse<PageResponse<Blog>>> getAll(@RequestParam(defaultValue = "1") int page,
                                                                      @RequestParam(defaultValue = "5") int size,
                                                                      @RequestParam(defaultValue = "id,desc") String sort,
                                                                      @RequestParam(required = false) String filter,
                                                                      @RequestParam(required = false) String searchField,
                                                                      @RequestParam(required = false) String searchValue,
                                                                      @RequestParam(required = false) boolean all) {
       try {
            PageResponse<Blog>pageResponse=
                    new PageResponse<>(blogService.findAll(page, size, sort, filter, searchField, searchValue, all));
            return ResponseEntity.ok(
                    RequestResponse.success(pageResponse,"Lấy blog thành công")
            );
       }catch (Exception e) {
           return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                   .body(RequestResponse.error(e.getMessage()));
       }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Tìm kiếm blog dựa theo Id")
    public ResponseEntity<RequestResponse<Blog>> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(RequestResponse.success(blogService.findById(id)));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RequestResponse.error(e.getMessage()));
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RequestResponse<Void>> create(@Valid @ModelAttribute BlogDTO dto, BindingResult bindingResult,@RequestParam(value = "image", required = false) MultipartFile image) {
        if(bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Dữ liệu không hợp lệ");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RequestResponse.error(errorMessage));
        }
        try {
            blogService.create(dto, image);
            return ResponseEntity.ok(RequestResponse.success("Thêm blog thành công"));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RequestResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật Blog")
    public ResponseEntity<RequestResponse<Void>> update(@PathVariable Long id, @ModelAttribute BlogDTO dto,BindingResult bindingResult,@RequestParam(value = "image", required = false) MultipartFile image) {
        if(bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Dữ liệu không hợp lệ");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RequestResponse.error(errorMessage));
        }
        try {
            blogService.update(id, dto, image);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật blog thành công"));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RequestResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa Blog")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        blogService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
