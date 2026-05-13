package org.a_in_hotel.be.service.impl;

import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.entity.Account;
import org.a_in_hotel.be.entity.PasswordResetOtp;
import org.a_in_hotel.be.repository.AccountRepository;
import org.a_in_hotel.be.repository.PasswordResetOtpRepository;
import org.a_in_hotel.be.service.ForgotPasswordService;
import org.a_in_hotel.be.util.EmailService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class ForgotPasswordServiceImpl implements ForgotPasswordService {
    private final AccountRepository repository;
    private final PasswordResetOtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public void sendOtp(String email) {
        Account account = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));
        String otp = String.valueOf(
                100000 + new Random().nextInt(900000)
        );
        PasswordResetOtp resetOtp = PasswordResetOtp.builder()
                .email(email)
                .otp(otp)
                .expiredAt(LocalDateTime.now().plusMinutes(5))
                .used(false)
                .build();
        otpRepository.save(resetOtp);
        emailService.sendResetPasswordByOTP(account.getEmail(), otp);
    }

    @Override
    public void resendPassword(String email, String otp, String newPassword) {
        PasswordResetOtp resetOtp = otpRepository
                .findTopByEmailAndOtpAndUsedFalseOrderByIdDesc(email,otp)
                .orElseThrow(()->new RuntimeException("Invalid Otp"));
        if(resetOtp.getExpiredAt().isBefore(LocalDateTime.now())){
            throw new RuntimeException("Otp expired");
        }
        Account account = repository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("Account not found"));
        account.setPassword(
                passwordEncoder.encode(newPassword)
        );
        repository.save(account);
        resetOtp.setUsed(true);
        otpRepository.save(resetOtp);
    }
}
