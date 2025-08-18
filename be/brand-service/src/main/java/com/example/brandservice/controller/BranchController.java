package com.example.brandservice.controller;

import com.example.brandservice.Enum.BranchStatus;
import com.example.brandservice.dto.RequestResponse;
import com.example.brandservice.dto.request.BranchRequest;
import com.example.brandservice.exception.ExceptionResponse;
import com.example.brandservice.service.BranchService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/branch")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class BranchController {
    @Autowired
    private BranchService branchService;
    @PostMapping("/create")
    public ResponseEntity<?>create(@RequestBody BranchRequest branchRequest, @RequestHeader("Authorization")String authorization) {
        try {
            branchService.save(branchRequest,authorization);
            return ResponseEntity.ok(new RequestResponse("Branch created successfully"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse("An error occurred: " + e.getMessage()));
        }
    }
    @PutMapping("update/{id}")
    public ResponseEntity<?>update(@RequestBody BranchRequest branchRequest, @PathVariable Long id,@RequestHeader("Authorization")String authorization) {
        try {
            branchService.update(branchRequest,authorization,id);
            return ResponseEntity.ok(new RequestResponse("Branch updated successfully"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse("An error occurred: " + e.getMessage()));
        }
    }
    @PutMapping("updateStatus/{id}")
    public ResponseEntity<?>updateStatus(@RequestBody BranchStatus branchStatus, @PathVariable Long id) {
        try {
            branchService.updateStatus(branchStatus,id);
            return ResponseEntity.ok(new RequestResponse("Branch updated Status successfully"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse("An error occurred: " + e.getMessage()));
        }
    }
}
