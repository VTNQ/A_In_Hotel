package com.example.brandservice.service.impl;

import com.example.brandservice.Enum.BranchStatus;
import com.example.brandservice.client.AuthServiceClient;
import com.example.brandservice.dto.RequestResponse;
import com.example.brandservice.dto.request.BranchRequest;
import com.example.brandservice.dto.response.AccountDTO;
import com.example.brandservice.entity.Branch;
import com.example.brandservice.mapper.BranchMapper;
import com.example.brandservice.repository.BranchRepository;
import com.example.brandservice.service.BranchService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class BrandServiceImpl implements BranchService {
    @Autowired
    private BranchRepository brandRepository;
    @Autowired
    private BranchMapper branchMapper;
    @Autowired
    private AuthServiceClient authServiceClient;

    @Override
    public void save(BranchRequest branch, String token) {
        try {
            log.info("save branch:{}", branch);
            RequestResponse<Map<String, Object>> res = authServiceClient.isAdmin(branch.getIdUser(),token);
            Boolean isAdmin = (Boolean) res.getData().get("isAdmin");

            if (!Boolean.TRUE.equals(isAdmin)) {
                throw new RuntimeException("Bạn không có quyền ADMIN để tạo branch");
            }

            Branch branchEntity = branchMapper.toEntity(branch);
            brandRepository.save(branchEntity);
        } catch (Exception e) {
            e.printStackTrace();
            log.warn("fail save branch:{}", e.getMessage());
            throw  e;

        }
    }

    @Override
    public void update(BranchRequest branch, Long id,String token) {
    try {
        Optional<Branch> optional = brandRepository.findById(id);
        if(optional.isPresent()) {
            Branch branchEntity = optional.get();
            RequestResponse<Map<String, Object>> res = authServiceClient.isAdmin(branch.getIdUser(),token);
            Boolean isAdmin = (Boolean) res.getData().get("isAdmin");

            if (!Boolean.TRUE.equals(isAdmin)) {
                throw new RuntimeException("Bạn không có quyền ADMIN để tạo branch");
            }
            branchEntity=branchMapper.toEntity(branch);
            brandRepository.save(branchEntity);
        }
    }catch (Exception e) {
        e.printStackTrace();
        log.warn("fail save branch:{}", e.getMessage());
        throw  e;
    }
    }

    @Override
    public void updateStatus(BranchStatus branchStatus, Long id) {
        try {
            Optional<Branch> optional = brandRepository.findById(id);
            if(optional.isPresent()) {
                Branch branchEntity = optional.get();
               branchEntity.setStatus(branchStatus);
               brandRepository.save(branchEntity);
            }
        }catch (Exception e) {
            e.printStackTrace();
            log.warn("update status branch:{}", e.getMessage());
        }
    }
}
