package org.a_in_hotel.be.validator;


import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.a_in_hotel.be.dto.request.BannerRequest;

public class EndAfterStartValidator implements ConstraintValidator<EndAfterStart, BannerRequest> {

    @Override
    public boolean isValid(BannerRequest value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        if(value.getEndAt()==null){
            return true;
        }
        return value.getEndAt().isAfter(value.getStartAt());
    }
}
