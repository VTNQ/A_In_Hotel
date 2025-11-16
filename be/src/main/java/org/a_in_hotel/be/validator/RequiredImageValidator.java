    package org.a_in_hotel.be.validator;

    import jakarta.validation.ConstraintValidator;
    import jakarta.validation.ConstraintValidatorContext;
    import org.a_in_hotel.be.annotation.RequiredImage;
    import org.springframework.stereotype.Component;
    import org.springframework.web.multipart.MultipartFile;
    @Component
    public class RequiredImageValidator implements ConstraintValidator<RequiredImage, MultipartFile> {
        @Override
        public boolean isValid(MultipartFile multipartFile, ConstraintValidatorContext constraintValidatorContext) {
            return multipartFile != null && !multipartFile.isEmpty();
        }
    }
