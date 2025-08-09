package com.example.authservice.controller;

import com.example.authservice.dto.RequestResponse;
import com.example.authservice.dto.request.AccountDTO;
import com.example.authservice.entity.Account;
import com.example.authservice.exception.ExceptionResponse;
import com.example.authservice.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AccountController {
    @Autowired
    private AccountService accountService;
    @PostMapping("/register")
    public ResponseEntity<?>create(@RequestBody AccountDTO accountDTO) {
        try {
            accountService.save(accountDTO);
            return ResponseEntity.ok(new RequestResponse("Đăng ký tài khoản thành công"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse(e.getMessage()));
        }
    }
}
