package com.phucnghia.controller;

import com.phucnghia.dto.request.AssignmentRequest;
import com.phucnghia.dto.response.AssignmentResponse;
import com.phucnghia.service.AssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<AssignmentResponse> assign(@Valid @RequestBody AssignmentRequest r) {
        return ResponseEntity.ok(assignmentService.assign(r));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssignmentResponse> update(@PathVariable Long id,
                                                     @Valid @RequestBody AssignmentRequest r) {
        return ResponseEntity.ok(assignmentService.update(id, r));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        assignmentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-staff")
    public ResponseEntity<List<AssignmentResponse>> getByStaff(
            @RequestParam Long staffId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(assignmentService.findByStaff(staffId, from, to));
    }
}
