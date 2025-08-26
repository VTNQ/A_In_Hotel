package com.example.fileservice.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class GeneralService {
    public String saveFile(MultipartFile file,String subDirectory) throws IOException,java.io.IOException{
        String fileName= StringUtils.cleanPath(file.getOriginalFilename());
        String uploadDir = System.getProperty("user.dir") + "/file-service/src/main/resources/static/" + subDirectory;
        Path path= Paths.get(uploadDir);
        if(!Files.exists(path)){
            Files.createDirectory(path);
        }
        Path filePath=path.resolve(file.getOriginalFilename());
        file.transferTo(filePath.toFile());
        return "/"+subDirectory+file.getOriginalFilename();
    }
}
