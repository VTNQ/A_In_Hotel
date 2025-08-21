package com.example.authservice.client;

import com.example.authservice.dto.RequestResponse;
import com.example.authservice.dto.request.UserRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-service",url = "http://localhost:8083")
public interface UserServiceClient {
    @PostMapping("/api/user/register")
    RequestResponse register(@RequestBody UserRequest userRequest);
}
