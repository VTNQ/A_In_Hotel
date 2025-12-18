package org.a_in_hotel.be.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = StartAtFutureOrPresentValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface StartAtFutureOrPresent {
    String message() default "startAt phải từ thời điểm hiện tại trở đi";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
