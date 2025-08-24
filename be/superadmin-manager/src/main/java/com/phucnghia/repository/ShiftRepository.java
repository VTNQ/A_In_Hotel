package com.phucnghia.repository;

import com.phucnghia.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShiftRepository extends JpaRepository<Shift, Long> {
    boolean existsByCode(String code);
    Optional<Shift> findByCode(String code);
}
