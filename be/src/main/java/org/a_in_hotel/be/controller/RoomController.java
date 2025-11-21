package org.a_in_hotel.be.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.RoomRequest;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.dto.response.RoomResponse;
import org.a_in_hotel.be.entity.Room;
import org.a_in_hotel.be.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@Tag(name = "room")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class RoomController {
    private final RoomService roomService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RequestResponse<Void>> create(@Valid @ModelAttribute RoomRequest request, @RequestPart(value = "image", required = false) List<MultipartFile> images) {

        try {
            roomService.save(request, images);
            return ResponseEntity.ok(RequestResponse.success("Thêm phòng thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<RequestResponse<RoomResponse>> findById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(RequestResponse.success(roomService.findById(id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<RequestResponse<PageResponse<RoomResponse>>> getAll(@RequestParam(defaultValue = "1") int page,
                                                                              @RequestParam(defaultValue = "5") int size,
                                                                              @RequestParam(defaultValue = "id,desc") String sort,
                                                                              @RequestParam(required = false) String filter,
                                                                              @RequestParam(required = false) String searchField,
                                                                              @RequestParam(required = false) String searchValue,
                                                                              @RequestParam(required = false) boolean all) {
        try {
            PageResponse<RoomResponse> pageResponse =
                    new PageResponse<>(roomService.getListRoom(page, size, sort, filter, searchField, searchValue, all));
            return ResponseEntity.ok(
                    RequestResponse.success(pageResponse, "Lấy room thành công")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(RequestResponse.error("Get All Config: " + e.getMessage()));
        }
    }

    @PutMapping(value = "/update/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RequestResponse<Void>> update(@PathVariable Long id, @Valid @ModelAttribute RoomRequest request, BindingResult bindingResult, @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Dữ liệu không hợp lệ");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RequestResponse.error(errorMessage));
        }
        try {
            roomService.update(id, request, images);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật phòng thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/updateStatus/{id}")
    public ResponseEntity<RequestResponse<Void>> updateStatus(
            @PathVariable Long id,
            @RequestParam Integer status) {
        try {
            roomService.updateStatus(id, status);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật trạng thái phòng thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

}
