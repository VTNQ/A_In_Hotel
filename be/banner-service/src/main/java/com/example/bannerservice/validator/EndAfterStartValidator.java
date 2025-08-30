package com.example.bannerservice.validator;

import com.example.bannerservice.dto.request.BannerRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;

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
