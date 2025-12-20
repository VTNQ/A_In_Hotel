package org.a_in_hotel.be.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public class StartAtFutureOrPresentValidator
implements ConstraintValidator<StartAtFutureOrPresent, OffsetDateTime> {
    @Override
    public boolean isValid(OffsetDateTime value, ConstraintValidatorContext constraintValidatorContext) {
        if (value == null) {
            return true; // null để @NotNull xử lý nếu cần
        }
        return !value.isBefore(OffsetDateTime.now());
    }
}
