package com.example.userservice.service.impl;

import com.example.userservice.dto.request.UserRequest;
import com.example.userservice.entity.User;
import com.example.userservice.mapper.UserMapper;
import com.example.userservice.repository.UserRepository;
import com.example.userservice.service.UserService;
import com.example.userservice.util.SortHelper;
import io.github.perplexhub.rsql.RSQLJPASupport;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;
    @Override
    public void save(UserRequest userRequest) {
        User user=userMapper.toEntity(userRequest);
        userRepository.save(user);
    }

    @Override
    public void update(UserRequest userRequest,Long accountId) {
        try {
            Optional<User>optional=userRepository.findByAccountId(accountId);
            if(optional.isPresent()){
                User user=optional.get();
                user=userMapper.toEntity(userRequest);
                userRepository.save(user);
            }
        }catch (Exception e){
            e.printStackTrace();
            log.warn("save user error:{}",e.getMessage());
            throw new RuntimeException("save user error");
        }
    }

    @Override
    public List<User> getAll(List<Long> accountId) {
        try {
          return userRepository.findAllByAccountId(accountId);
        }catch (Exception e){
            log.error("getAll user error:{}",e.getMessage());
            throw new RuntimeException("getAll user error");
        }
    }
}
