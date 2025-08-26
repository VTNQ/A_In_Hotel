package com.example.fileservice.controller;


import com.example.commonutils.api.RequestResponse;
import com.example.fileservice.dto.response.FileUploadMeta;
import com.example.fileservice.service.GeneralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;

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
}
