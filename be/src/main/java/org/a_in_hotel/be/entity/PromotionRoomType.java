package org.a_in_hotel.be.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(
        name = "promotion_room_types",
        indexes = {
                @Index(
                        name = "idx_prt_promotion_room_type",
                        columnList = "promotion_id,room_type_id"
                )
        }
)
@Data
public class PromotionRoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    @ManyToOne
    @JoinColumn(name = "room_type_id")
    private Category roomTypeId;

    private Boolean excluded;
}
