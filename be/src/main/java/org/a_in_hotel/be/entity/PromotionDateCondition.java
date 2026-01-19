package org.a_in_hotel.be.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(
        name = "promotion_date_condition",
        indexes = {
                @Index(
                        name = "idx_prt_promotion_date_condition",
                        columnList = "promotion_id"
                )
        }
)
@Data
public class PromotionDateCondition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    private Integer dayType;

}
