package com.example.hotelservice.client;

import com.example.hotelservice.dto.RequestResponse;
import com.example.hotelservice.dto.response.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "user-service",url = "http://localhost:8083")
public interface UserServiceClient {

    @GetMapping("/api/user/getAll")
    RequestResponse<List<User>> getAll(
           @RequestParam("ids")List<Long> ids
    );
}
