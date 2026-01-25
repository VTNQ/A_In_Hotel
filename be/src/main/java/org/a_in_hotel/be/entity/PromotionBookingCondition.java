package org.a_in_hotel.be.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(
        name = "promotion_booking_condition",
        indexes = {
                @Index(
                        name = "idx_prt_promotion_booking_condition",
                        columnList = "promotion_id"
                )
        }
)
@Data
public class PromotionBookingCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    private Integer bookingType;


    private Integer minNights;

}
