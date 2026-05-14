package org.a_in_hotel.be.service;

public interface ForgotPasswordService {

    void sendOtp(String email);

    void resendPassword(String email,String otp,String newPassword);
}
