package org.a_in_hotel.be.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(
        name = "promotion_customer_condition",
        indexes = {
                @Index(
                        name = "idx_prt_promotion_customer_condition",
                        columnList = "promotion_id"
                )
        }
)
@Data
public class PromotionCustomerCondition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    private Integer customerType;


}
