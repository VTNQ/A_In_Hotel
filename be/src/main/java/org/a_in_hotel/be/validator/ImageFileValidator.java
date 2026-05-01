package org.a_in_hotel.be.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.a_in_hotel.be.annotation.ImageFile;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
@Component
public class ImageFileValidator implements ConstraintValidator<ImageFile, MultipartFile> {
    @Override
    public boolean isValid(MultipartFile multipartFile, ConstraintValidatorContext constraintValidatorContext) {
        if(multipartFile == null || multipartFile.isEmpty()){
            return false;
        }
        try {
            BufferedImage image = ImageIO.read(multipartFile.getInputStream());
            return image != null;
        }catch (IOException e){
            return false;
        }
    }
}
