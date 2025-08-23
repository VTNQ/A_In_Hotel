package com.example.authservice.client;

import com.example.authservice.dto.RequestResponse;
import com.example.authservice.dto.request.UserRequest;
import com.example.authservice.dto.response.PageResponse;
import com.example.authservice.dto.response.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-service",url = "http://localhost:8083")
public interface UserServiceClient {
    @PostMapping("/api/user/register")
    RequestResponse register(@RequestBody UserRequest userRequest);
    @GetMapping("/api/user/getAll")
    RequestResponse<PageResponse<User>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "false") boolean all
    );
}
