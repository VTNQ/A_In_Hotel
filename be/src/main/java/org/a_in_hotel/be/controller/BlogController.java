package org.a_in_hotel.be.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.annotation.RequiredImage;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.BlogRequest;
import org.a_in_hotel.be.dto.request.BlogUpdateRequest;
import org.a_in_hotel.be.dto.response.BlogResponse;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.entity.Blog;
import org.a_in_hotel.be.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/blogs")
@Tag(name = "blog")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class BlogController {
    private final BlogService blogService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Create a blog")
    public ResponseEntity<RequestResponse<Void>> create(@Valid @ModelAttribute BlogRequest request) {
        try {
            blogService.save(request, request.getImage());
            return ResponseEntity.ok(RequestResponse.success("Blog created successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update a blog")
    public ResponseEntity<RequestResponse<Void>> update(@PathVariable Long id, @Valid @ModelAttribute BlogUpdateRequest request, @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            blogService.update(id, request, image);
            return ResponseEntity.ok(RequestResponse.success("Blog updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    @Operation(summary = "Get List Blog")
    public ResponseEntity<RequestResponse<PageResponse<BlogResponse>>> getAll(@RequestParam(defaultValue = "1") int page,
                                                                      @RequestParam(defaultValue = "5") int size,
                                                                      @RequestParam(defaultValue = "id,desc") String sort,
                                                                      @RequestParam(required = false) String filter,
                                                                      @RequestParam(required = false) String searchField,
                                                                      @RequestParam(required = false) String searchValue,
                                                                      @RequestParam(required = false) boolean all) {
        try {
            PageResponse<BlogResponse> pageResponse =
                    new PageResponse<>(blogService.getAll(page, size, sort, filter, searchField, searchValue, all));
            return ResponseEntity.ok(RequestResponse.success(pageResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
    @GetMapping("/{id}")
    @Operation(summary = "Get Blog By Id")
    public ResponseEntity<RequestResponse<BlogResponse>> getById(@PathVariable Long id) {
        try {
            BlogResponse blogResponse = blogService.getById(id);
            return ResponseEntity.ok(RequestResponse.success(blogResponse));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
    @PatchMapping("/{id}/status")
    @Operation(summary = "update status blog by id")
    public ResponseEntity<RequestResponse<Void>> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        try {
            blogService.updateStatus(id, status);
            return ResponseEntity.ok(RequestResponse.success("Updated status successfully"));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
}
