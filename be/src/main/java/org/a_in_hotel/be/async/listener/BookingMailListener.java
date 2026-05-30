package org.a_in_hotel.be.async.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.async.event.BookingCreatedEvent;
import org.a_in_hotel.be.entity.Booking;
import org.a_in_hotel.be.repository.BookingRepository;
import org.a_in_hotel.be.util.EmailService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookingMailListener {
    private final BookingRepository bookingRepository;
    private final EmailService emailService;
    @Async
    @TransactionalEventListener(
            phase = TransactionPhase.AFTER_COMMIT
    )
    public void handleBookingCreated(
            BookingCreatedEvent event
    ){
        try {
            Booking booking = bookingRepository
                    .findByIdWithCustomer(event.getBookingId())
                    .orElseThrow();
            String email = booking.getEmail();
            if(email == null || email.isBlank()){
                return;
            }
            String fullName =
                    booking.getCustomer().getFirstName()
                            + " "
                            + booking.getCustomer().getLastName();
            emailService.sendBookingConfirmationEmail(
                    email,
                    fullName,
                    booking
            );
            log.info("Booking email sent {}",
                    booking.getId()
            );
        }catch (Exception e){
            log.error("Send booking email failed",e);
        }
    }
}
