package org.a_in_hotel.be.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.request.BlogDTO;
import org.a_in_hotel.be.dto.response.BlogResponse;
import org.a_in_hotel.be.service.BlogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@Tag(name = "blog")
@RequiredArgsConstructor
public class BlogController {
    private final BlogService blogService;

    @GetMapping
    @Operation(summary = "Lấy danh sách blog")
    public ResponseEntity<List<BlogResponse>> getAll() {
        return ResponseEntity.ok(blogService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Tìm kiếm blog dựa theo Id")
    public ResponseEntity<BlogResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.findById(id));
    }

    @PostMapping
    public ResponseEntity<BlogResponse> create(@RequestBody BlogDTO dto) {
        return ResponseEntity.ok(blogService.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật Blog")
    public ResponseEntity<BlogResponse> update(@PathVariable Long id, @RequestBody BlogDTO dto) {
        return ResponseEntity.ok(blogService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa Blog")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        blogService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
