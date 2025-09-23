package org.a_in_hotel.be.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = EndAfterStartValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface EndAfterStart {
    String message() default "endAt phải sau startAt";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
