package com.phucnghia.mapper;

import com.phucnghia.dto.request.StaffRequest;
import com.phucnghia.dto.response.StaffResponse;
import com.phucnghia.entity.Staff;
import org.springframework.stereotype.Component;

@Component
public class StaffMapper {

    public Staff toEntity(StaffRequest r) {
        if (r == null) return null;
        return Staff.builder()
                .fullName(r.getFullName())
                .phone(r.getPhone())
                .email(r.getEmail())
                .role(r.getRole())
                .salary(r.getSalary())
                .active(r.getActive() == null ? true : r.getActive())
                .build();
    }

    public void updateEntity(Staff entity, StaffRequest r) {
        entity.setFullName(r.getFullName());
        entity.setPhone(r.getPhone());
        entity.setEmail(r.getEmail());
        entity.setRole(r.getRole());
        entity.setSalary(r.getSalary());
        if (r.getActive() != null) entity.setActive(r.getActive());
    }

    public StaffResponse toResponse(Staff s) {
        if (s == null) return null;
        return StaffResponse.builder()
                .id(s.getId())
                .fullName(s.getFullName())
                .phone(s.getPhone())
                .email(s.getEmail())
                .role(s.getRole())
                .salary(s.getSalary())
                .active(s.getActive())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }
}
