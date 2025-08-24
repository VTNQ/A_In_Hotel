package com.phucnghia.repository;

import com.phucnghia.entity.WorkAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface WorkAssignmentRepository extends JpaRepository<WorkAssignment, Long> {
    boolean existsByStaff_IdAndWorkDateAndShift_Id(Long staffId, LocalDate date, Long shiftId);
    List<WorkAssignment> findByStaff_IdAndWorkDateBetween(Long staffId, LocalDate from, LocalDate to);
}
