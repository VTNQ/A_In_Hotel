package com.example.systemconfigservice.controller;

import com.example.commonutils.api.PageResponse;
import com.example.commonutils.api.RequestResponse;
import com.example.systemconfigservice.dto.request.SystemConfigRequest;
import com.example.systemconfigservice.entity.SystemConfig;
import com.example.systemconfigservice.service.SystemConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/system-configs")
@Tag(name = "system-config")
public class SystemConfigController {
    @Autowired
    private SystemConfigService systemConfigService;

    @PostMapping("/create")
    @Operation(summary = "Thêm System Config")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tạo Config thành công",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = RequestResponse.class))),
    })
    public ResponseEntity<RequestResponse<Void>> create(@RequestBody SystemConfigRequest systemConfigRequest) {
        try {
            systemConfigService.save(systemConfigRequest);
            return ResponseEntity.ok(RequestResponse.success("Tạo Config thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RequestResponse<Void>> update(@RequestBody SystemConfigRequest systemConfigRequest, @PathVariable Long id) {
        try {
            systemConfigService.update(id, systemConfigRequest);
            return ResponseEntity.ok(RequestResponse.error("Cập nhật Config thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error( e.getMessage()));
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<RequestResponse<PageResponse<SystemConfig>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) boolean all) {

        try {
            PageResponse<SystemConfig> pageData =
                    new PageResponse<>(systemConfigService.getAll(page, size, sort, filter, search, all));

            return ResponseEntity.ok(RequestResponse.success(pageData));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(RequestResponse.error( "Get All Config: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<RequestResponse<Void>> deleteById(@PathVariable Long id) {
        try {
            systemConfigService.delete(id);
            return ResponseEntity.ok(RequestResponse.success("Delete Config"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error("Delete Config: " + e.getMessage()));
        }

    }
}
