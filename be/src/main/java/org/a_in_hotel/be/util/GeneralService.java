package org.a_in_hotel.be.util;

import io.minio.*;
import io.minio.errors.MinioException;
import org.a_in_hotel.be.dto.response.FileUploadMeta;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.rmi.RemoteException;
import java.util.UUID;

@Service
public class GeneralService {
    @Value("${minio.bucket-name}")
    private String bucketName;
    private final MinioClient minioClient;
    public GeneralService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    public FileUploadMeta saveFile(MultipartFile file, String subDirectory) throws IOException, IOException{
       try {
           boolean found = minioClient.bucketExists(BucketExistsArgs.builder()
                   .bucket(bucketName)
                   .build());
           if(!found){
               minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
           }
           String originalName=file.getOriginalFilename();
           String extension="";
           if(originalName !=null && originalName.contains(".")){
               extension=originalName.substring(originalName.lastIndexOf("."));
           }
           String uniqueName= UUID.randomUUID().toString()+extension;
           String fileName = (subDirectory != null && !subDirectory.isEmpty()
                   ? subDirectory + "/" : "") + uniqueName;
           try (InputStream inputStream = file.getInputStream()) {
               minioClient.putObject(
                       PutObjectArgs.builder()
                               .bucket(bucketName)
                               .object(fileName)
                               .stream(inputStream,file.getSize(),-1)
                               .contentType(file.getContentType())
                               .build()
               );
           }
           FileUploadMeta meta = new FileUploadMeta();
           meta.setUrl("/" + bucketName + "/" + fileName);
           meta.setAltText(file.getOriginalFilename());
           meta.setSizeBytes(file.getSize());
           meta.setImageType(file.getContentType());
           try (InputStream is = minioClient.getObject(
                   GetObjectArgs.builder()
                           .bucket(bucketName)
                           .object(fileName)
                           .build()
           )) {
               BufferedImage bufferedImage = ImageIO.read(is);
               if (bufferedImage != null) {
                   meta.setWidth(bufferedImage.getWidth());
                   meta.setHeight(bufferedImage.getHeight());
               }
           } catch (Exception e) {
               throw new RuntimeException("Không thể đọc ảnh từ MinIO: " + e.getMessage(), e);
           }
           return meta;
       }catch (MinioException e){
           throw new RuntimeException("Lỗi MinIo:"+e.getMessage(),e);
       }catch (Exception e){
           throw new RemoteException("Không thể upload file:"+e.getMessage(),e);
       }
    }
}
