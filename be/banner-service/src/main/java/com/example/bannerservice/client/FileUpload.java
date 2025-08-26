package com.example.bannerservice.client;

import com.example.bannerservice.dto.RequestResponse;
import com.example.bannerservice.dto.response.FileUploadMeta;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
@FeignClient(name = "file-service", url = "http://localhost:8484/api/file")
public interface FileUpload {
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    RequestResponse<FileUploadMeta> uploadFile(@RequestPart("file") MultipartFile file,
                                               @RequestPart("path") String path);
}
