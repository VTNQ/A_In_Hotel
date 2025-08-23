package com.example.systemconfigservice.controller;

import com.example.systemconfigservice.dto.RequestResponse;
import com.example.systemconfigservice.dto.request.SystemConfigRequest;
import com.example.systemconfigservice.dto.response.PageResponse;
import com.example.systemconfigservice.exception.ExceptionResponse;
import com.example.systemconfigservice.service.SystemConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/system-config")
public class SystemConfigController {
    @Autowired
    private SystemConfigService systemConfigService;
    @PostMapping("/create")
    public ResponseEntity<?>create(@RequestBody SystemConfigRequest systemConfigRequest){
        try {
            systemConfigService.save(systemConfigRequest);
            return ResponseEntity.ok(new RequestResponse<>("Tạo Config thành công"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse(e.getMessage()));
        }
    }
    @PostMapping("/update/{id}")
    public ResponseEntity<?>update(@RequestBody SystemConfigRequest systemConfigRequest, @PathVariable Long id){
        try {
            systemConfigService.update(id, systemConfigRequest);
            return  ResponseEntity.ok(new RequestResponse<>("Cập nhật Config thành công"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse("Update Config: " + e.getMessage()));
        }
    }
    @GetMapping("/getAll")
    public ResponseEntity<?>getAll(@RequestParam(defaultValue = "1") int page,
                                   @RequestParam(defaultValue = "5") int size,
                                   @RequestParam(defaultValue = "id,desc") String sort,
                                   @RequestParam(required = false) String filter,
                                   @RequestParam(required = false) String search,
                                   @RequestParam(required = false) boolean all){
        try {
            return ResponseEntity.ok(new RequestResponse<>(new PageResponse(systemConfigService.getAll(page, size, sort, filter, search, all))));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse("Get All Config: " + e.getMessage()));
        }
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?>deleteById(@PathVariable Long id){
        try {
            systemConfigService.delete(id);
            return ResponseEntity.ok(new RequestResponse<>("Delete Config"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse("Delete Config: " + e.getMessage()));
        }

    }
}
