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
            @RequestParam(required = false, name = "search") String q,
            @RequestParam(required = false, name = "filter") String rsql,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(defaultValue = "id,desc") String sort
    ) {
        var result = assetService.findAll(page, size, sort, rsql, "asset_name", q, false);
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
            @Valid @RequestBody AssetUpdateRequest req,
            @RequestHeader("Authorization") String authHeader
    ) {
        String actorEmail = extractEmailFromAuth(authHeader);
        AssetResponse res = assetService.update(id, req, actorEmail);
        return ResponseEntity.ok(RequestResponse.success(res, "Cập nhật asset thành công"));
    }

    // ===================== CẬP NHẬT / TOGGLE TRẠNG THÁI =====================
    @PatchMapping("/{id}/status")
    public ResponseEntity<RequestResponse<AssetResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody(required = false) AssetStatusUpdateRequest req, // có thể null nếu toggle
            @RequestHeader("Authorization") String authHeader
    ) {
        String actorEmail = extractEmailFromAuth(authHeader);

        // Nếu client không gửi body, tạo request rỗng để toggle
        if (req == null) req = new AssetStatusUpdateRequest();

        AssetResponse res = assetService.updateStatus(id, req, actorEmail);
        return ResponseEntity.ok(RequestResponse.success(res, "Cập nhật trạng thái thành công"));
    }

    // ===================== CHI TIẾT =====================
    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse<AssetResponse>> detail(@PathVariable Long id) {
        AssetResponse res = assetService.getById(id);
        return ResponseEntity.ok(RequestResponse.success(res));
    }

    // ===================== JWT HELPER =====================
    private String extractEmailFromAuth(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return "system@a-in-hotel.com";
        }
        String token = authHeader.substring(7);
        try {
            return jwtService.extractEmail(token);
        } catch (Exception e) {
            return "system@a-in-hotel.com";
        }
    }
}
