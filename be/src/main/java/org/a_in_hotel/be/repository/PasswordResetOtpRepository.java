package org.a_in_hotel.be.repository;

import org.a_in_hotel.be.entity.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetOtpRepository  extends JpaRepository<PasswordResetOtp,Long> {
    Optional<PasswordResetOtp> findTopByEmailAndOtpAndUsedFalseOrderByIdDesc(
            String email,
            String otp
    );
}
