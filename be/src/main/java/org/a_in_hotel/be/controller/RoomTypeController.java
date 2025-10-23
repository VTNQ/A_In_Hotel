package org.a_in_hotel.be.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.RoomTypeRequest;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.entity.RoomType;
import org.a_in_hotel.be.service.RoomTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/room-types")
@Tag(name = "room-type")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class RoomTypeController {
    private final RoomTypeService roomTypeService;

    @PostMapping("/create")
    public ResponseEntity<RequestResponse<Void>> create(@Valid @RequestBody RoomTypeRequest request) {
        try {
            roomTypeService.save(request);
            return ResponseEntity.ok(RequestResponse.success("Thêm loại phòng thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<RequestResponse<Void>> update(@PathVariable Long id, @RequestBody RoomTypeRequest request) {
        try {
            roomTypeService.update(id, request);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật loại phòng thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<RequestResponse<PageResponse<RoomType>>> getAll(@RequestParam(defaultValue = "1") int page,
                                                                          @RequestParam(defaultValue = "5") int size,
                                                                          @RequestParam(defaultValue = "id,desc") String sort,
                                                                          @RequestParam(required = false) String filter,
                                                                          @RequestParam(required = false) String searchField,
                                                                          @RequestParam(required = false) String searchValue,
                                                                          @RequestParam(required = false) boolean all) {
        try {
            return ResponseEntity.ok(RequestResponse.success(new PageResponse<>(roomTypeService.getAll(page, size, sort, filter, searchField, searchValue, all))));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<RequestResponse<RoomType>> findById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(RequestResponse.success(roomTypeService.getById(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/updateStatus/{id}")
    public ResponseEntity<RequestResponse<Void>> updateStatus(@PathVariable Long id, @RequestParam Boolean status) {
        try {
            roomTypeService.updateStatus(id, status);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật trạng thái thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
}
