package com.example.userservice.service;

import com.example.userservice.dto.request.UserRequest;

public interface UserService {
    void save(UserRequest userRequest);
}
