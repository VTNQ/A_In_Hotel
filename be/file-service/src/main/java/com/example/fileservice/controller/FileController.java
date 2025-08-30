package com.example.fileservice.controller;


import com.example.commonutils.api.RequestResponse;
import com.example.fileservice.dto.response.FileUploadMeta;
import com.example.fileservice.service.GeneralService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/file")
public class FileController {
    @Autowired
    private GeneralService generalService;
    @PostMapping(value = "/upload",  consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?>uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("path")String path){
        try {
            String url = generalService.saveFile(file, path);
            String imageType=null;
            if(file.getContentType().startsWith("image/")){
                imageType=file.getContentType().substring("image/".length());
            }
            long sizeBytes=file.getSize();
            String original=file.getOriginalFilename();
            String altText=null;
            if(StringUtils.hasText(original)){
                int dot=original.lastIndexOf('.');
                altText=dot>0?original.substring(0,dot):original;
            }
            Integer width=null,height=null;
            if(file.getContentType().startsWith("image")){
                try {
                    BufferedImage image = ImageIO.read(file.getInputStream());
                    if(image!=null){
                        width=image.getWidth();
                        height=image.getHeight();
                    }
                }catch (Exception ignore){}
            }
            FileUploadMeta  fileUploadMeta=new FileUploadMeta();
            fileUploadMeta.setUrl(url);
            fileUploadMeta.setAltText(altText);
            fileUploadMeta.setWidth(width);
            fileUploadMeta.setHeight(height);
            fileUploadMeta.setImageType(imageType);
            fileUploadMeta.setSizeBytes(sizeBytes);
            return ResponseEntity.ok(RequestResponse.success(fileUploadMeta));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RequestResponse.error(e.getMessage()));
        }
    }
    @GetMapping("/**")
    public ResponseEntity<Resource> getImage(HttpServletRequest request) {
        // Lấy toàn bộ URI được gọi
        String fullPath = request.getRequestURI(); // /api/file/main/product/moderno-0139665883.webp

        // Tên route bạn đã định nghĩa trong controller
        String basePath = "/api/file/";

        // Cắt phần filename từ URL
        String encoded = fullPath.substring(fullPath.indexOf(basePath) + basePath.length());
        String filename = UriUtils.decode(encoded, StandardCharsets.UTF_8);

        // Đường dẫn thực tới file trong server
        String imagePath = System.getProperty("user.dir") +
                "/file-service/src/main/resources/static/" + filename;

        Resource image = new FileSystemResource(imagePath);

        if (!image.exists()) {
            return ResponseEntity.notFound().build();
        }

        // Xác định MIME type
        MediaType mediaType;
        if (filename.toLowerCase().endsWith(".png")) {
            mediaType = MediaType.IMAGE_PNG;
        } else if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
            mediaType = MediaType.IMAGE_JPEG;
        } else if (filename.toLowerCase().endsWith(".gif")) {
            mediaType = MediaType.IMAGE_GIF;
        } else if (filename.toLowerCase().endsWith(".webp")) {
            mediaType = MediaType.parseMediaType("image/webp");
        } else {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(image);
    }
}
