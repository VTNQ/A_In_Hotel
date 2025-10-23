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

    // 👉 Search tag
    @GetMapping
    public ResponseEntity<Page<TagDTO>> search(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String searchField,
            @RequestParam(required = false) String searchValue,
            @RequestParam(required = false) boolean all
    ) {
        return ResponseEntity.ok(tagService.search(page, size, sort, filter, searchField, searchValue, all));
    }
}
