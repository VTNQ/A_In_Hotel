package org.a_in_hotel.be.controller;

import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.dto.request.SystemContentRequest;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.dto.response.SystemContentResponse;
import org.a_in_hotel.be.service.SystemContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/system-content")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class SystemContentController {

    private final SystemContentService service;

    @PutMapping(value = "/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RequestResponse<Void>>update
            (
                    @PathVariable Long id,
                    @ModelAttribute SystemContentRequest request,
                    @RequestParam(value = "image",required = false) MultipartFile file
            ){
        try {
            service.update(id, request, file);
            return ResponseEntity.ok(RequestResponse.success("system content updated successfully"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse<SystemContentResponse>> findByContentKey
            (
                    @PathVariable Integer id
            ){
        try {
            return ResponseEntity.ok(RequestResponse.success(service.findByContentKey(id)));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error(e.getMessage()));
        }
    }
}
