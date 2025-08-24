package com.phucnghia.service.impl;

import com.phucnghia.dto.request.AssignmentRequest;
import com.phucnghia.dto.response.AssignmentResponse;
import com.phucnghia.entity.Shift;
import com.phucnghia.entity.Staff;
import com.phucnghia.entity.WorkAssignment;
import com.phucnghia.repository.ShiftRepository;
import com.phucnghia.repository.StaffRepository;
import com.phucnghia.repository.WorkAssignmentRepository;
import com.phucnghia.service.AssignmentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AssignmentServiceImpl implements AssignmentService {

    private final WorkAssignmentRepository assignmentRepo;
    private final StaffRepository staffRepo;
    private final ShiftRepository shiftRepo;

    @Override
    public AssignmentResponse assign(AssignmentRequest r) {
        Staff staff = staffRepo.findById(r.getStaffId())
                .orElseThrow(() -> new IllegalArgumentException("Staff not found: " + r.getStaffId()));
        Shift shift = shiftRepo.findById(r.getShiftId())
                .orElseThrow(() -> new IllegalArgumentException("Shift not found: " + r.getShiftId()));

        if (assignmentRepo.existsByStaff_IdAndWorkDateAndShift_Id(staff.getId(), r.getWorkDate(), shift.getId())) {
            throw new IllegalArgumentException("Duplicate assignment for staff/shift/date");
        }

        WorkAssignment a = WorkAssignment.builder()
                .staff(staff)
                .shift(shift)
                .workDate(r.getWorkDate())
                .note(r.getNote())
                .build();

        return toResponse(assignmentRepo.save(a));
    }

    @Override
    public AssignmentResponse update(Long id, AssignmentRequest r) {
        WorkAssignment a = assignmentRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + id));

        Staff staff = staffRepo.findById(r.getStaffId())
                .orElseThrow(() -> new IllegalArgumentException("Staff not found: " + r.getStaffId()));
        Shift shift = shiftRepo.findById(r.getShiftId())
                .orElseThrow(() -> new IllegalArgumentException("Shift not found: " + r.getShiftId()));

        // nếu thay đổi -> check trùng
        if (!(a.getStaff().getId().equals(staff.getId())
                && a.getShift().getId().equals(shift.getId())
                && a.getWorkDate().equals(r.getWorkDate()))) {
            if (assignmentRepo.existsByStaff_IdAndWorkDateAndShift_Id(staff.getId(), r.getWorkDate(), shift.getId())) {
                throw new IllegalArgumentException("Duplicate assignment for staff/shift/date");
            }
        }

        a.setStaff(staff);
        a.setShift(shift);
        a.setWorkDate(r.getWorkDate());
        a.setNote(r.getNote());
        return toResponse(assignmentRepo.save(a));
    }

    @Override
    public void delete(Long id) {
        if (!assignmentRepo.existsById(id)) throw new IllegalArgumentException("Assignment not found: " + id);
        assignmentRepo.deleteById(id);
    }

    @Override
    public List<AssignmentResponse> findByStaff(Long staffId, LocalDate from, LocalDate to) {
        if (from == null) from = LocalDate.now();
        if (to == null) to = from.plusDays(30);
        return assignmentRepo.findByStaff_IdAndWorkDateBetween(staffId, from, to)
                .stream().map(this::toResponse).toList();
    }

    private AssignmentResponse toResponse(WorkAssignment a) {
        return AssignmentResponse.builder()
                .id(a.getId())
                .staffId(a.getStaff().getId())
                .staffName(a.getStaff().getFullName())
                .shiftId(a.getShift().getId())
                .shiftCode(a.getShift().getCode())
                .startTime(a.getShift().getStartTime())
                .endTime(a.getShift().getEndTime())
                .workDate(a.getWorkDate())
                .note(a.getNote())
                .build();
    }
}
