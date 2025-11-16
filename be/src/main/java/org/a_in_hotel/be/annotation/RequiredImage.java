package org.a_in_hotel.be.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import org.a_in_hotel.be.validator.RequiredImageValidator;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = RequiredImageValidator.class)
public @interface RequiredImage {
    String message() default "Image is required";
    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
