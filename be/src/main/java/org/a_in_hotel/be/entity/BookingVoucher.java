package org.a_in_hotel.be.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "booking_voucher")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingVoucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false,unique = true)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "voucher_id",nullable = false)
    private Voucher voucher;

    @Column(name = "original_amount",nullable = false)
    private BigDecimal originalAmount;

    @Column(name = "discount_amount",nullable = false)
    private BigDecimal discountAmount;

    @Column(name = "final_amount", nullable = false)
    private BigDecimal finalAmount;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}
