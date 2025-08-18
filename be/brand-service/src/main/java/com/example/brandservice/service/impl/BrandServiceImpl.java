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
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
            RequestResponse<AccountDTO> me = authServiceClient.getMyInfo(token);
            Long userId = Optional.ofNullable(me)
                    .map(RequestResponse::getData)
                    .map(AccountDTO::getId)
                    .orElseThrow(() -> new IllegalStateException("Không lấy được id user từ auth-service"));
            Branch branchEntity = branchMapper.toEntity(branch);
            branchEntity.setIdUser(userId);
            brandRepository.save(branchEntity);
        } catch (Exception e) {
            e.printStackTrace();
            log.warn("fail save branch:{}", e.getMessage());

        }
    }

    @Override
    public void update(BranchRequest branch, String token, Long id) {
    try {
        Optional<Branch> optional = brandRepository.findById(id);
        if(optional.isPresent()) {
            Branch branchEntity = optional.get();
            branchEntity=branchMapper.toEntity(branch);
            RequestResponse<AccountDTO> me = authServiceClient.getMyInfo(token);
            Long userId = Optional.ofNullable(me)
                    .map(RequestResponse::getData)
                    .map(AccountDTO::getId)
                    .orElseThrow(() -> new IllegalStateException("Không lấy được id user từ auth-service"));
            branchEntity.setIdUser(userId);
            brandRepository.save(branchEntity);
        }
    }catch (Exception e) {
        e.printStackTrace();
        log.warn("fail save branch:{}", e.getMessage());
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
