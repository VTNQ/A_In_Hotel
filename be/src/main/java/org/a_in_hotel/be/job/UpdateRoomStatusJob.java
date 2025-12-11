package org.a_in_hotel.be.job;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.Enum.BookingPackage;
import org.a_in_hotel.be.Enum.BookingStatus;
import org.a_in_hotel.be.Enum.RoomStatus;
import org.a_in_hotel.be.entity.Booking;
import org.a_in_hotel.be.entity.BookingDetail;
import org.a_in_hotel.be.repository.BookingRepository;
import org.a_in_hotel.be.repository.RoomRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class UpdateRoomStatusJob {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    @Scheduled(cron = "0 0 12 * * *", zone = "Asia/Ho_Chi_Minh")
    @Transactional
    public void updateRoomStatusForOvernightAndFullDay(){
        log.info("=== Start job update room status at 02:00 AM ===");

        List<Integer> packages = List.of(
                BookingPackage.OVERNIGHT.getCode(),
                BookingPackage.FULL_DAY.getCode());

        List<Booking> bookings = bookingRepository.findBookingsForRoomUpdate(
                packages,
                BookingStatus.BOOKED.getCode());
        for (Booking booking : bookings) {
            booking.getDetails().size();
            for (BookingDetail detail : booking.getDetails()) {

                if(detail.getRoom()==null) continue;

                detail.getRoom().setStatus(RoomStatus.OCCUPIED.getCode());
                roomRepository.save(detail.getRoom());


                log.info("Room {} set to OCCUPIED for booking {}",
                         detail.getRoom().getId(), booking.getId());
            }
        }

        log.info("=== Job completed ====");
    }
}
