package com.phucnghia.service.impl;

import com.phucnghia.dto.request.StaffRequest;
import com.phucnghia.dto.response.StaffResponse;
import com.phucnghia.entity.Staff;
import com.phucnghia.mapper.StaffMapper;
import com.phucnghia.repository.StaffRepository;
import com.phucnghia.service.StaffService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;
    private final StaffMapper staffMapper;

    @Override
    public StaffResponse create(StaffRequest request) {
        if (request.getEmail() != null && staffRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + request.getEmail());
        }
        Staff entity = staffMapper.toEntity(request);
        return staffMapper.toResponse(staffRepository.save(entity));
    }

    @Override
    public StaffResponse update(Long id, StaffRequest request) {
        Staff s = staffRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found: " + id));

        if (request.getEmail() != null && !request.getEmail().equalsIgnoreCase(s.getEmail())
                && staffRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + request.getEmail());
        }

        staffMapper.updateEntity(s, request);
        return staffMapper.toResponse(staffRepository.save(s));
    }

    @Override
    public void delete(Long id) {
        if (!staffRepository.existsById(id)) throw new IllegalArgumentException("Staff not found: " + id);
        staffRepository.deleteById(id);
    }

    @Override
    public StaffResponse findById(Long id) {
        return staffRepository.findById(id).map(staffMapper::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found: " + id));
    }

    @Override
    public List<StaffResponse> findAll() {
        return staffRepository.findAll().stream().map(staffMapper::toResponse).toList();
    }
}
