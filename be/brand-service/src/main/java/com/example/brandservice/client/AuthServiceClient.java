package com.example.brandservice.client;

import com.example.brandservice.dto.RequestResponse;
import com.example.brandservice.dto.response.AccountDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "authservice",url = "http://localhost:8585")
public interface AuthServiceClient {
    @GetMapping("/api/account/role")
    String getUserRole(@RequestParam("email")String email);
    @GetMapping("/api/account/me")
    RequestResponse<AccountDTO> getMyInfo(@RequestHeader("Authorization")String authorization);
}
