package org.a_in_hotel.be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.StaffRequest;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.dto.response.StaffResponse;
import org.a_in_hotel.be.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staffs")
@RequiredArgsConstructor
public class StaffController {
    @Autowired
    private StaffService staffService;

    @PostMapping(value = "/create")
    public ResponseEntity<RequestResponse<Void>> create(@Valid @RequestBody StaffRequest request) {
        try {
            staffService.createStaff(request);
            return ResponseEntity.ok(RequestResponse.success("Thêm nhân viên thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @GetMapping(value = "/getAll")
    public ResponseEntity<RequestResponse<PageResponse<StaffResponse>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String searchField,
            @RequestParam(required = false) String searchValue,
            @RequestParam(required = false) boolean all
    ) {
        try {
            PageResponse<StaffResponse> pageResponse =
                    new PageResponse<>(staffService.getAll(page, size, sort, filter, searchField, searchValue, all));
            return ResponseEntity.ok(RequestResponse.success(pageResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error("Get All staff:" + e.getMessage()));
        }
    }
    @PatchMapping(value = "/updateStatus/{id}")
    public ResponseEntity<RequestResponse<Void>> updateStatus(@PathVariable Long id, @RequestParam Boolean status) {
        try {
            staffService.updateStatus(id, status);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật trạng thái thành công"));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
}
