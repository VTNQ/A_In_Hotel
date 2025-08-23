package com.example.userservice.service;

import com.example.userservice.dto.request.UserRequest;
import com.example.userservice.entity.User;
import org.springframework.data.domain.Page;

public interface UserService {
    void save(UserRequest userRequest);
    void update(UserRequest userRequest,Long accountId);
    Page<User>getALl(int page, int size, String sort, String filter, String search, boolean all);
}
