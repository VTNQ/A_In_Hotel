package org.a_in_hotel.be.controller;

import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.request.CategoryDTO;
import org.a_in_hotel.be.dto.response.CategoryResponse;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.entity.Category;
import org.a_in_hotel.be.service.CategoryService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // 👉 Tạo mới category
    @PostMapping
    public ResponseEntity<RequestResponse<Void>> create(@RequestBody CategoryDTO dto) {
        categoryService.create(dto);
        return ResponseEntity.ok(RequestResponse.success("Thêm category thành công"));
    }

    // 👉 Cập nhật category theo id
    @PutMapping("/{id}")
    public ResponseEntity<RequestResponse<Void>> update(@PathVariable Long id,
                                              @RequestBody CategoryDTO dto) {
        try {
            categoryService.update(id, dto);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật blog thành công"));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }

    }

    // 👉 Xóa cứng category
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 👉 Soft delete (nếu có field active trong entity)
    @PatchMapping("/{id}/soft-delete")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        categoryService.softDelete(id);
        return ResponseEntity.noContent().build();
    }
    @PatchMapping("/updateStatus/{id}")
    public ResponseEntity<RequestResponse<Void>>updateStatus(@PathVariable Long id,@RequestParam Boolean status){
        try {
            categoryService.updateStatus(id,status);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật trạng thái danh mục thành công"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));

        }
    }
    // 👉 Lấy category theo id
    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse<Category>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(RequestResponse.success(categoryService.get(id)));
    }


    // 👉 Search categories
    @GetMapping
    public ResponseEntity<Page<CategoryResponse>> search(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String searchField,
            @RequestParam(required = false) String searchValue,
            @RequestParam(required = false) boolean all
    ) {
        return ResponseEntity.ok(categoryService.search(page, size, sort, filter, searchField, searchValue, all));
    }
}

