package phucnghia.blog_service.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import phucnghia.blog_service.dto.BlogDTO;
import phucnghia.blog_service.dto.BlogResponse;
import phucnghia.blog_service.service.BlogService;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class BlogController {
    private final BlogService blogService;

    @GetMapping
    public ResponseEntity<List<BlogResponse>> getAll() {
        return ResponseEntity.ok(blogService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.findById(id));
    }

    @PostMapping
    public ResponseEntity<BlogResponse> create(@RequestBody BlogDTO dto) {
        return ResponseEntity.ok(blogService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogResponse> update(@PathVariable Long id, @RequestBody BlogDTO dto) {
        return ResponseEntity.ok(blogService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        blogService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
