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

    // Danh sách + filter + search + pagination (default 20)
    // Danh sách + filter (RSQL) + search (q) + pagination/sort
    @GetMapping
    public ResponseEntity<RequestResponse<PageResponse<AssetResponse>>> list(
            @RequestParam(required = false, name = "search") String q,
            @RequestParam(required = false, name = "filter") String rsql,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        var req = AssetFilterRequest.builder()
                .keyword(q)
                .filter(rsql)
                .page(page).size(size).sort(sort)
                .build();
        var result = assetService.findAll(req);
        return ResponseEntity.ok(RequestResponse.success(new PageResponse<>(result)));
    }



    // Tạo mới
    @PostMapping
    public ResponseEntity<RequestResponse<AssetResponse>> create(
            @Valid @RequestBody AssetCreateRequest req,
            @RequestHeader("Authorization") String authHeader
    ) {
        String actorEmail = extractEmailFromAuth(authHeader);
        assetService.create(req, actorEmail); // vẫn tạo & ghi history


        return ResponseEntity.status(HttpStatus.CREATED)
                .body(RequestResponse.success("Tạo asset thành công"));
    }


    // Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<RequestResponse<AssetResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody AssetUpdateRequest req,
            @RequestHeader("Authorization") String authHeader
    ) {
        String actorEmail = extractEmailFromAuth(authHeader);
        AssetResponse res = assetService.update(id, req, actorEmail);
        return ResponseEntity.ok(RequestResponse.success(res, "Cập nhật asset thành công"));
    }

    // Đổi trạng thái (Good/Maintenance/Broken/Deactivated)
    @PatchMapping("/{id}/status")
    public ResponseEntity<RequestResponse<AssetResponse>> changeStatus(
            @PathVariable Long id,
            @Valid @RequestBody AssetStatusUpdateRequest req,
            @RequestHeader("Authorization") String authHeader
    ) {
        String actorEmail = extractEmailFromAuth(authHeader);
        AssetResponse res = assetService.changeStatus(id, req, actorEmail);
        return ResponseEntity.ok(RequestResponse.success(res, "Đổi trạng thái thành công"));
    }

    // Toggle Deactivated (block/unblock)
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<RequestResponse<AssetResponse>> toggle(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader
    ) {
        String actorEmail = extractEmailFromAuth(authHeader);
        AssetResponse res = assetService.toggleDeactivated(id, actorEmail);
        return ResponseEntity.ok(RequestResponse.success(res, "Thao tác toggle thành công"));
    }

        // Chi tiết
        @GetMapping("/{id}")
        public ResponseEntity<RequestResponse<AssetResponse>> detail(@PathVariable Long id) {
            AssetResponse res = assetService.getById(id);
            return ResponseEntity.ok(RequestResponse.success(res));
        }

    // Lấy email từ JWT (tham chiếu JwtService của bạn)
    private String extractEmailFromAuth(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return "system@a-in-hotel.com"; // fallback
        }
        String token = authHeader.substring(7);
        try {
            return jwtService.extractEmail(token);  // dùng service thật của bạn
        } catch (Exception e) {                     // bắt chung, không cần import JwtException
            // log.warn("Invalid JWT: {}", e.getMessage());
            return "system@a-in-hotel.com";        // fallback an toàn
        }
    }
}
