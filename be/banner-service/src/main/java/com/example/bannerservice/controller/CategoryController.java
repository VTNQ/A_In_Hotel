package com.example.bannerservice.controller;

import com.example.bannerservice.dto.RequestResponse;
import com.example.bannerservice.dto.request.CategoryRequest;
import com.example.bannerservice.dto.response.PageResponse;
import com.example.bannerservice.entity.Category;
import com.example.bannerservice.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/banner-categories")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class CategoryController {
    @Autowired
    private CategoryService categoryService;
    @PostMapping("/create")
    public ResponseEntity<RequestResponse<Void>>create(@RequestBody CategoryRequest categoryRequest){
        try {
            categoryService.add(categoryRequest);
            return ResponseEntity.ok(RequestResponse.success("Thêm danh mục thành công"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<RequestResponse<Void>> update(@PathVariable Long id, @RequestBody CategoryRequest categoryRequest){
        try {
            categoryService.update(categoryRequest,id);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật danh mục thành công"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
    @GetMapping("getAll")
    public ResponseEntity<RequestResponse<PageResponse<Category>>>getAll(@RequestParam(defaultValue = "1") int page,
                                                                         @RequestParam(defaultValue = "5") int size,
                                                                         @RequestParam(defaultValue = "id,desc") String sort,
                                                                         @RequestParam(required = false) String filter,
                                                                         @RequestParam(required = false) String search,
                                                                         @RequestParam(required = false) boolean all){
        try {
            PageResponse<Category> pageResponse =
                    new PageResponse<>(categoryService.getAll(page, size, sort, filter, search, all)); // dùng <>

            return ResponseEntity.ok(
                    RequestResponse.success(pageResponse, "Lấy danh mục thành công")
            );
        }catch (Exception e){
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.<PageResponse<Category>>error(e.getMessage()));
        }
    }
    @GetMapping("getById/{id}")
    public ResponseEntity<RequestResponse<Category>>getById(@PathVariable Long id){
        try {
            Category category = categoryService.findById(id);
            return ResponseEntity.ok(RequestResponse.success(category));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.<Category>error(e.getMessage()));
        }
    }
}
