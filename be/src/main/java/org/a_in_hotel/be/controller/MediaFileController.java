package org.a_in_hotel.be.controller;

import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.request.MediaFileDTO;
import org.a_in_hotel.be.service.MediaFileService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/media-files")
@RequiredArgsConstructor
public class MediaFileController {

    private final MediaFileService mediaFileService;

    @PostMapping
    public ResponseEntity<MediaFileDTO> create(@RequestBody MediaFileDTO dto) {
        return ResponseEntity.ok(mediaFileService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MediaFileDTO> update(@PathVariable Long id, @RequestBody MediaFileDTO dto) {
        return ResponseEntity.ok(mediaFileService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        mediaFileService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/soft-delete")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        mediaFileService.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaFileDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(mediaFileService.get(id));
    }

    @GetMapping("/by-file-name/{fileName}")
    public ResponseEntity<MediaFileDTO> getByFileName(@PathVariable String fileName) {
        return ResponseEntity.ok(mediaFileService.getByFileName(fileName));
    }

    @GetMapping
    public ResponseEntity<Page<MediaFileDTO>> search(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        return ResponseEntity.ok(mediaFileService.search(q, page, size, sort));
    }
}
