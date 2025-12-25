package org.a_in_hotel.be.util;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendRegistrationEmail(String to, String fullName, String email, String password) throws MessagingException {
        // Gắn dữ liệu vào template
        Context context = new Context();
        context.setVariable("fullName", fullName);
        context.setVariable("email", email);
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
                "hotel_admin_assigned",
                    context
        );
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message,true,"UTF-8");
        helper.setTo(to);
        helper.setSubject("Bạn đã được gán quản lý khách sạn");
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
}
