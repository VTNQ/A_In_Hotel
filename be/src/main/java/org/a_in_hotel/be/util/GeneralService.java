package org.a_in_hotel.be.util;

import org.a_in_hotel.be.dto.response.FileUploadMeta;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class GeneralService {
    public FileUploadMeta saveFile(MultipartFile file, String subDirectory) throws IOException, IOException{
        String fileName= StringUtils.cleanPath(file.getOriginalFilename());
        String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/" + subDirectory;
        Path path = Paths.get(uploadDir);

        if (!Files.exists(path)) {
            Files.createDirectories(path); // tạo cả cha + con nếu chưa có
        }

        // Lưu file
        Path filePath = path.resolve(fileName);
        file.transferTo(filePath.toFile());

        // Khởi tạo metadata
        FileUploadMeta meta = new FileUploadMeta();
        meta.setUrl("/" + subDirectory + fileName);
        meta.setAltText(fileName);
        meta.setSizeBytes(file.getSize());
        meta.setImageType(file.getContentType());

        // Nếu file là ảnh → lấy width/height
        try {
            BufferedImage bufferedImage = ImageIO.read(filePath.toFile());
            if (bufferedImage != null) {
                meta.setWidth(bufferedImage.getWidth());
                meta.setHeight(bufferedImage.getHeight());
            }
        } catch (Exception e) {
            // Không phải ảnh thì bỏ qua width/height
        }

        return meta;
    }
}
