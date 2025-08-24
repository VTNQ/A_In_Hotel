package com.example.hotelservice.client;

import com.example.hotelservice.dto.RequestResponse;
import com.example.hotelservice.dto.response.AccountDTO;
import com.example.hotelservice.dto.response.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

@FeignClient(name = "authservice",url = "http://localhost:8585")
public interface AuthServiceClient {
    @GetMapping("/api/account/role")
    String getUserRole(@RequestParam("email")String email);
    @GetMapping("/api/user/getAll")
    RequestResponse<List<User>> getAll(@RequestParam("ids") List<Long> ids);
    @GetMapping("/api/account/me")
    RequestResponse<AccountDTO> getMyInfo(@RequestHeader("Authorization")String authorization);
    @GetMapping("/api/account/is-Superadmin")
    RequestResponse<Map<String, Object>> isAdmin(@RequestParam("userId") Long userId,@RequestHeader("Authorization")String authorization);
}
