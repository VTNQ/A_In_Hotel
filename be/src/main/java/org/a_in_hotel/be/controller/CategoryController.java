package org.a_in_hotel.be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.request.CategoryDTO;
import org.a_in_hotel.be.dto.response.CategoryResponse;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.entity.Category;
import org.a_in_hotel.be.service.CategoryService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // 👉 Tạo mới category
    @PostMapping
    public ResponseEntity<RequestResponse<Void>> create(@Valid @RequestBody  CategoryDTO dto) {
        categoryService.create(dto);
        return ResponseEntity.ok(RequestResponse.success("Thêm category thành công"));
    }

    // 👉 Cập nhật category theo id
    @PutMapping("/{id}")
    public ResponseEntity<RequestResponse<Void>> update(@PathVariable Long id,
                                              @Valid @RequestBody CategoryDTO dto) {
            categoryService.update(id, dto);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật danh mục thành công"));

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

            categoryService.updateStatus(id,status);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật trạng thái danh mục thành công"));

    }
    // 👉 Lấy category theo id
    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse<CategoryResponse>> getById(@PathVariable Long id) {
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

