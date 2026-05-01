package org.a_in_hotel.be.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import org.a_in_hotel.be.validator.ImageFileValidator;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;

@Target({ FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ImageFileValidator.class)
public @interface ImageFile {
    String message() default "Invalid image file";
    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
