package org.a_in_hotel.be.util;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.entity.Booking;
import org.a_in_hotel.be.entity.Hotel;
import org.a_in_hotel.be.repository.HotelRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final HotelRepository hotelRepository;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine,HotelRepository hotelRepository) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.hotelRepository = hotelRepository;
    }

    public void sendRegistrationEmail(String to, String fullName, String password) throws MessagingException {
        // Gắn dữ liệu vào template
        Context context = new Context();
        context.setVariable("fullName", fullName);
        context.setVariable("email", to);
        context.setVariable("password", password);

        String htmlContent = templateEngine.process("account-register", context);

        // Tạo email
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject("Đăng ký tài khoản thành công");
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
    public void sendHotelAdminAssignmentEmail(
            String to,
            String fullName,
            String hotelName
    ) throws MessagingException {

        Context context = new Context();
        context.setVariable("fullName",fullName);
        context.setVariable("hotelName",hotelName);
        context.setVariable("loginUrl","https://admin.ainhotelvn.com");
        String htmlContent = templateEngine.process(
                "hotel-admin-assigned",
                    context
        );
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message,true,"UTF-8");
        helper.setTo(to);
        helper.setSubject("Bạn đã được gán quản lý khách sạn");
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
    public void sendResetPasswordByOTP(String to,String otp) {
            try {
                Context context = new Context();
                context.setVariable("otp",otp);
                String html = templateEngine.process(
                        "reset-password", context
                );
                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage,true,"UTF-8");
                helper.setTo(to);
                helper.setSubject("Reset Password OTP");
                helper.setText(html, true);
                mailSender.send(mimeMessage);
            }catch (Exception e){
                e.printStackTrace();
            }
    }
    public void sendBookingConfirmationEmail(
            String to,
            String fullName,
            Booking booking
    ) throws MessagingException {
        Context context = new Context();
        context.setVariable("fullName",fullName);
        context.setVariable(
                "bookingCode",
                booking.getCode()
        );
        Hotel hotel = hotelRepository.findById(booking.getHotelId()).orElse(null);
        context.setVariable(
                "hotelName",
                hotel != null ? hotel.getName() : "Khách sạn"
        );
        context.setVariable(
                "checkIn",
                booking.getCheckInDate()
        );

        context.setVariable(
                "checkOut",
                booking.getCheckOutDate()
        );

        context.setVariable(
                "totalAmount",
                booking.getTotalPrice()
        );

        context.setVariable(
                "bookingUrl",
                "https://ainhotelvn.com/my-booking"
        );
        String htmlContent =
                templateEngine.process(
                        "booking-confirm",
                        context
                );
        MimeMessage message =
                mailSender.createMimeMessage();
        MimeMessageHelper helper =
                new MimeMessageHelper(
                        message,
                        true,
                        "UTF-8"
                );
        helper.setTo(to);
        helper.setSubject(
                "Booking Confirmation - "
                        + booking.getCode()
        );

        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
}
