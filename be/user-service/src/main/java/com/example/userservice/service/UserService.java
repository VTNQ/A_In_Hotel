package com.example.userservice.service;

import com.example.userservice.dto.request.UserRequest;
import com.example.userservice.entity.User;
import org.springframework.data.domain.Page;

import java.util.List;

public interface UserService {
    void save(UserRequest userRequest);
    void update(UserRequest userRequest,Long accountId);
    List<User>getAll(List<Long> accountId);
}
