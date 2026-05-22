package org.a_in_hotel.be.async.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.async.event.SendOtpEvent;
import org.a_in_hotel.be.async.event.SendRegistrationEvent;
import org.a_in_hotel.be.util.EmailService;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthMailListener {
    private final EmailService emailService;
    @Async
    @TransactionalEventListener(
            phase = TransactionPhase.AFTER_COMMIT
    )
    public void handleSendOtp(
            SendOtpEvent event
    ){
        log.info("Sending OTP mail to {}",event.getEmail());

        emailService.sendResetPasswordByOTP(
                event.getEmail(),
                event.getOtp()
        );
    }

    @Async
    @TransactionalEventListener(
            phase = TransactionPhase.AFTER_COMMIT
    )
    public void handleSendRegistrationEmail(
            SendRegistrationEvent event
    ){
        try {
            log.info("Sending registration mail to {}",event.getEmail());

            emailService.sendRegistrationEmail(
                    event.getEmail(),
                    event.getFullName(),
                    event.getPassword()
            );
        }catch (Exception e){
            log.error("Send registration email failed",e);
        }
    }
}
