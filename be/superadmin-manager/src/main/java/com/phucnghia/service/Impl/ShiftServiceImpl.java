package com.phucnghia.service.impl;

import com.phucnghia.dto.request.ShiftRequest;
import com.phucnghia.dto.response.ShiftResponse;
import com.phucnghia.entity.Shift;
import com.phucnghia.repository.ShiftRepository;
import com.phucnghia.service.ShiftService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ShiftServiceImpl implements ShiftService {

    private final ShiftRepository shiftRepository;

    @Override
    public ShiftResponse create(ShiftRequest r) {
        if (shiftRepository.existsByCode(r.getCode()))
            throw new IllegalArgumentException("Shift code exists: " + r.getCode());
        if (!r.getEndTime().isAfter(r.getStartTime()))
            throw new IllegalArgumentException("endTime must be after startTime");
        Shift s = Shift.builder()
                .code(r.getCode().trim())
                .startTime(r.getStartTime())
                .endTime(r.getEndTime())
                .description(r.getDescription())
                .build();
        s = shiftRepository.save(s);
        return toResponse(s);
    }

    @Override
    public ShiftResponse update(Long id, ShiftRequest r) {
        Shift s = shiftRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Shift not found: " + id));
        if (!s.getCode().equalsIgnoreCase(r.getCode()) && shiftRepository.existsByCode(r.getCode()))
            throw new IllegalArgumentException("Shift code exists: " + r.getCode());
        if (!r.getEndTime().isAfter(r.getStartTime()))
            throw new IllegalArgumentException("endTime must be after startTime");

        s.setCode(r.getCode().trim());
        s.setStartTime(r.getStartTime());
        s.setEndTime(r.getEndTime());
        s.setDescription(r.getDescription());
        return toResponse(shiftRepository.save(s));
    }

    @Override
    public void delete(Long id) {
        if (!shiftRepository.existsById(id)) throw new IllegalArgumentException("Shift not found: " + id);
        shiftRepository.deleteById(id);
    }

    @Override
    public ShiftResponse findById(Long id) {
        return shiftRepository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Shift not found: " + id));
    }

    @Override
    public List<ShiftResponse> findAll() {
        return shiftRepository.findAll().stream().map(this::toResponse).toList();
    }

    private ShiftResponse toResponse(Shift s) {
        return ShiftResponse.builder()
                .id(s.getId())
                .code(s.getCode())
                .startTime(s.getStartTime())
                .endTime(s.getEndTime())
                .description(s.getDescription())
                .build();
    }
}
