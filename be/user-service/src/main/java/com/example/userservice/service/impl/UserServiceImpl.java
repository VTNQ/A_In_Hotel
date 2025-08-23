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
    public Page<User> getALl(int page, int size, String sort, String filter, String search, boolean all) {
        try {
            page = Math.max(page, 1);
            size = Math.min(Math.max(size, 1), 200);
            Specification<User>users=Specification.where(null);
            if (filter != null && !filter.isBlank()) {
                users = users.and(RSQLJPASupport.<User>toSpecification(filter));
            }
            if (search != null && !search.isBlank()) {
                users = users.and(RSQLJPASupport.<User>toSpecification(search));
            }
            Pageable pageable = all
                    ? Pageable.unpaged()
                    : PageRequest.of(page - 1, size, SortHelper.parseSort(sort));
            return userRepository.findAll(users,pageable);
        }catch (Exception e){
            log.error("getAll user error:{}",e.getMessage());
            throw new RuntimeException("getAll user error");
        }
    }
}
