package org.a_in_hotel.be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "paid_amount",precision = 15,scale = 2,nullable = false)
    private BigDecimal paidAmount;

    @Column(name = "payment_method")
    private String paymentMethod;

    private Integer paymentType;

    @Column(name = "notes")
    private String notes;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
