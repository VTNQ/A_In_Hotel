package com.example.bannerservice.controller;

import com.example.bannerservice.dto.RequestResponse;
import com.example.bannerservice.dto.request.CategoryRequest;
import com.example.bannerservice.dto.response.PageResponse;
import com.example.bannerservice.exception.ExceptionResponse;
import com.example.bannerservice.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class CategoryController {
    @Autowired
    private CategoryService categoryService;
    @PostMapping("/create")
    public ResponseEntity<?>create(@RequestBody CategoryRequest categoryRequest){
        try {
            categoryService.add(categoryRequest);
            return ResponseEntity.ok(new RequestResponse("Thêm danh mục thành công"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse(e.getMessage()));
        }
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CategoryRequest categoryRequest){
        try {
            categoryService.update(categoryRequest,id);
            return ResponseEntity.ok(new RequestResponse<>("Cập nhật danh mục thành công"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse(e.getMessage()));
        }
    }
    @GetMapping("getAll")
    public ResponseEntity<?>getAll(@RequestParam(defaultValue = "1") int page,
                                   @RequestParam(defaultValue = "5") int size,
                                   @RequestParam(defaultValue = "id,desc") String sort,
                                   @RequestParam(required = false) String filter,
                                   @RequestParam(required = false) String search,
                                   @RequestParam(required = false) boolean all){
        try {
            return ResponseEntity.ok(new RequestResponse<>(new PageResponse(categoryService.getAll(page, size, sort, filter, search, all))));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse(e.getMessage()));
        }
    }
    @GetMapping("getById/{id}")
    public ResponseEntity<?>getById(@PathVariable Long id){
        try {
            return ResponseEntity.ok(new RequestResponse<>(categoryService.findById(id)));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse(e.getMessage()));
        }
    }
}
