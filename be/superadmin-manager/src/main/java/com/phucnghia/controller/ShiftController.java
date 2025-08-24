package com.phucnghia.controller;

import com.phucnghia.dto.request.ShiftRequest;
import com.phucnghia.dto.response.ShiftResponse;
import com.phucnghia.service.ShiftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/shifts")
public class ShiftController {

    private final ShiftService shiftService;

    @PostMapping
    public ResponseEntity<ShiftResponse> create(@Valid @RequestBody ShiftRequest r) {
        return ResponseEntity.ok(shiftService.create(r));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShiftResponse> update(@PathVariable Long id, @Valid @RequestBody ShiftRequest r) {
        return ResponseEntity.ok(shiftService.update(id, r));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        shiftService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShiftResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(shiftService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<ShiftResponse>> findAll() {
        return ResponseEntity.ok(shiftService.findAll());
    }
}
