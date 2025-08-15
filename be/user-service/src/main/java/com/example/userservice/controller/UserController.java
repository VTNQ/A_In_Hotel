package com.example.userservice.controller;

import com.example.userservice.dto.RequestResponse;
import com.example.userservice.dto.request.UserRequest;
import com.example.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
