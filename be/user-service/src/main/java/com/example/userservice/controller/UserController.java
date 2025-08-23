package com.example.userservice.controller;

import com.example.userservice.dto.RequestResponse;
import com.example.userservice.dto.request.UserRequest;
import com.example.userservice.dto.response.PageResponse;
import com.example.userservice.exception.ExceptionResponse;
import com.example.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserController {
    @Autowired
    private UserService userService;
    @PostMapping("/register")
    public ResponseEntity<?>register(@RequestBody UserRequest userRequest) {
        userService.save(userRequest);
        return ResponseEntity.ok(new RequestResponse("Đăng ký tài khỏan thành công"));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UserRequest userRequest) {
        try {
            userService.update(userRequest,id);
            return ResponseEntity.ok(new RequestResponse("Cập nhật tài khỏan thành công"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse("An error occurred: " + e.getMessage()));
        }
    }
    @GetMapping("/getAll")
    public ResponseEntity<?> getAll(@RequestParam(defaultValue = "1") int page,
                                    @RequestParam(defaultValue = "5") int size,
                                    @RequestParam(defaultValue = "id,desc") String sort,
                                    @RequestParam(required = false) String filter,
                                    @RequestParam(required = false) String search,
                                    @RequestParam(required = false) boolean all) {
        try {
            var resultPage = userService.getALl(page, size, sort, filter, search, all);
            var body = new RequestResponse<>(new PageResponse<>(resultPage), "Lấy danh sách user thành công");
            return ResponseEntity.ok(body);
        }catch (Exception e){
            return ResponseEntity.ok(new ExceptionResponse("An error occurred: " + e.getMessage()));
        }
    }
}
