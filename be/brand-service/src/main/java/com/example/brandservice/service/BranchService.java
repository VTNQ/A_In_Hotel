package com.example.brandservice.service;

import com.example.brandservice.Enum.BranchStatus;
import com.example.brandservice.dto.request.BranchRequest;

public interface BranchService {
    void save(BranchRequest branch, String token);
    void update(BranchRequest branch,Long id,String token);
    void updateStatus(BranchStatus branchStatus, Long id);
}
