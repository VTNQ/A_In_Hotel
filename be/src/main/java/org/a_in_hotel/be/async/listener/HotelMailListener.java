package org.a_in_hotel.be.async.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.async.event.SendHotelAdminAssignmentEmailEvent;
import org.a_in_hotel.be.util.EmailService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class HotelMailListener {
    private final EmailService emailService;

    @Async
    @TransactionalEventListener(
            phase = TransactionPhase.AFTER_COMMIT
    )
    public void handleSendEmailHotelAdminAssigned(
            SendHotelAdminAssignmentEmailEvent event
    ){
        try {
            emailService.sendHotelAdminAssignmentEmail(
                    event.getEmail(),
                    event.getFullName(),
                    event.getHotelName()
            );
            log.info("Hotel admin assignment email sent to {}",event.getEmail());
        }catch (Exception e){
            log.error("Send hotel admin assignment email failed",e);
        }
    }
}
