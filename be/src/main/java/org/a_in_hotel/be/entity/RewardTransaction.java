package org.a_in_hotel.be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "reward_transaction")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RewardTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_code", unique = true, nullable = false)
    private String transactionCode;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "booking_id")
    private Long bookingId;
    private Integer type;
    @Column(name = "booking_code")
    private String bookingCode;
    @Column(name = "points", nullable = false)
    private Integer points;
    @Column(name = "balance_before", nullable = false)
    private Integer balanceBefore;
    @Column(name = "balance_after", nullable = false)
    private Integer balanceAfter;

    @Column(name = "description")
    private String description;

    @CreationTimestamp
    private OffsetDateTime createdAt;
}
