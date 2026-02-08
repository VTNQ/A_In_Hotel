package org.a_in_hotel.be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "customer_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerStats {
    @Id
    private Long customerId;

    @MapsId
    @OneToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(name = "total_completed_bookings")
    private Integer totalCompletedBookings = 0;

    @Column(name = "last_booking_at")
    private OffsetDateTime lastBookingAt;

    @Column(name = "reward_balance")
    private BigDecimal rewardBalance = BigDecimal.ZERO;

}
