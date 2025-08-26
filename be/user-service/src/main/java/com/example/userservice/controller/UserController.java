package com.example.userservice.controller;
import com.example.commonutils.api.RequestResponse;
import com.example.userservice.dto.request.UserRequest;
import com.example.userservice.entity.User;
import com.example.userservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@Tag(name = "User")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserController {
    @Autowired
    private UserService userService;
    @Operation(summary = "Đăng ký tài khoản")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",description = "Đăng ký thành công",
            content = @Content(mediaType = "application/json",
            schema = @Schema(implementation = RequestResponse.class))),
    })
    @PostMapping("/register")
    public ResponseEntity<RequestResponse<Void>>register(@RequestBody UserRequest userRequest) {
        userService.save(userRequest);
        return ResponseEntity.ok(RequestResponse.success("Đăng ký tài khỏan thành công"));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<RequestResponse<Void>> update(@PathVariable Long id, @RequestBody UserRequest userRequest) {
        try {
            userService.update(userRequest,id);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật tài khỏan thành công"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error("An error occurred: " + e.getMessage()));
        }
    }
    @GetMapping("/getAll")
    public ResponseEntity<RequestResponse<List<User>>> getAll(@RequestParam("ids") List<Long> ids) {
        try {
            var resultPage = userService.getAll(ids);
            var body = RequestResponse.success(resultPage, "Lấy danh sách user thành công");
            return ResponseEntity.ok(body);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error("An error occurred: " + e.getMessage()));
        }
    }
}
