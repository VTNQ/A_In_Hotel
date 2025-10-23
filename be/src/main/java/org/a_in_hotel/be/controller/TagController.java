package org.a_in_hotel.be.controller;

import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.request.TagDTO;
import org.a_in_hotel.be.service.TagService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    // 👉 Tạo mới tag
    @PostMapping
    public ResponseEntity<TagDTO> create(@RequestBody TagDTO dto) {
        return ResponseEntity.ok(tagService.create(dto));
    }

    // 👉 Cập nhật tag
    @PutMapping("/{id}")
    public ResponseEntity<TagDTO> update(@PathVariable Long id, @RequestBody TagDTO dto) {
        return ResponseEntity.ok(tagService.update(id, dto));
    }

    // 👉 Xóa tag
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tagService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 👉 Lấy tag theo id
    @GetMapping("/{id}")
    public ResponseEntity<TagDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(tagService.get(id));
    }

    // 👉 Lấy tag theo name
    @GetMapping("/by-name/{name}")
    public ResponseEntity<TagDTO> getByName(@PathVariable String name) {
        return ResponseEntity.ok(tagService.getByName(name));
    }

    // 👉 Search tag
    @GetMapping
    public ResponseEntity<Page<TagDTO>> search(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        return ResponseEntity.ok(tagService.search(q, page, size, sort));
    }
}
