package org.a_in_hotel.be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.config.JwtService;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.*;
import org.a_in_hotel.be.dto.response.AssetResponse;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.service.AssetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;
    private final JwtService jwtService;

    // ===================== DANH SÁCH =====================
    @GetMapping
    public ResponseEntity<RequestResponse<PageResponse<AssetResponse>>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String searchField,
            @RequestParam(required = false) String searchValue,
            @RequestParam(required = false) boolean all
    ) {
        var result = assetService.findAll(page, size, sort, filter, searchField, searchValue, all);
        return ResponseEntity.ok(RequestResponse.success(new PageResponse<>(result)));
    }

    // ===================== TẠO MỚI =====================
    @PostMapping
    public ResponseEntity<RequestResponse<Void>> create(
            @Valid @RequestBody AssetCreateRequest req
    ) {
        assetService.save(req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(RequestResponse.success("Tạo asset thành công"));
    }

    // ===================== CẬP NHẬT =====================
    @PutMapping("/{id}")
    public ResponseEntity<RequestResponse<AssetResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody AssetUpdateRequest req
    ) {
        assetService.update(id, req);
        return ResponseEntity.ok(RequestResponse.success( "Cập nhật asset thành công"));
    }

    // ===================== CẬP NHẬT / TOGGLE TRẠNG THÁI =====================
    @PatchMapping("/updateStatus/{id}")
    public ResponseEntity<RequestResponse<AssetResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam Integer status
    ) {
        assetService.updateStatus(id, status);
        return ResponseEntity.ok(RequestResponse.success("Cập nhật trạng thái thành công"));
    }

    // ===================== CHI TIẾT =====================
    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse<AssetResponse>> detail(@PathVariable Long id) {
        AssetResponse res = assetService.getById(id);
        return ResponseEntity.ok(RequestResponse.success(res));
    }


}
