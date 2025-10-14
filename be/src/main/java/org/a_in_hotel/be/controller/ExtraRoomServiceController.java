package org.a_in_hotel.be.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.ExtraServiceRequest;
import org.a_in_hotel.be.dto.response.ExtraServiceResponse;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.service.RoomExtraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/extra-room-service")
@Tag(name = "extra-service")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ExtraRoomServiceController {
    private final RoomExtraService extraService;
    @PostMapping("/create")
    public ResponseEntity<RequestResponse<Void>>create(@Valid @RequestBody ExtraServiceRequest extra, BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Dữ liệu không hợp lệ");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RequestResponse.error(errorMessage));
        }
        try {
            extraService.save(extra);
            return ResponseEntity.ok(RequestResponse.success("Thêm dịch vụ thành công"));
        }catch (Exception e){
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RequestResponse.error(e.getMessage()));
        }
    }
    @GetMapping("/all")
    public ResponseEntity<RequestResponse<PageResponse<ExtraServiceResponse>>>getAll(@RequestParam(defaultValue = "1") int page,
                                                                                     @RequestParam(defaultValue = "5") int size,
                                                                                     @RequestParam(defaultValue = "id,desc") String sort,
                                                                                     @RequestParam(required = false) String filter,
                                                                                     @RequestParam(required = false) String searchField,
                                                                                     @RequestParam(required = false) String searchValue,
                                                                                     @RequestParam(required = false) boolean all){
        try {
            return ResponseEntity.ok(RequestResponse.success(new PageResponse<>(extraService.getAll(page, size, sort, filter, searchField, searchValue, all))));
        }catch (Exception e){
            return ResponseEntity.badRequest()
                    .body(RequestResponse.error( "Get All extra room service: " + e.getMessage()));
        }
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<RequestResponse<Void>>update(@PathVariable Long id,@Valid @RequestBody ExtraServiceRequest extra, BindingResult bindingResult){
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                        .map(error -> error.getDefaultMessage())
                        .findFirst()
                        .orElse("Dữ liệu không hợp lệ");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RequestResponse.error(errorMessage));
            }
            extraService.update(extra,id);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật dịch vụ thành công"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RequestResponse.error(e.getMessage()));
        }
    }
    @PatchMapping("/updateStatus/{id}")
    public ResponseEntity<RequestResponse<Void>>updateStatus(@PathVariable Long id,@RequestParam Boolean status){
        try {
            extraService.updateStatus(id,status);
            return ResponseEntity.ok(RequestResponse.success("Cập nhật trạng thái dịch vụ thành công"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));

        }
    }

}
