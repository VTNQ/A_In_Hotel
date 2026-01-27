package org.a_in_hotel.be.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "voucher_room_type",
        indexes = {
                @Index(
                        name = "idx_vcr_room_type",
                        columnList = "voucher_id,room_type_id"
                )
        })
@Data
public class VoucherRoomType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    @ManyToOne
    @JoinColumn(name = "room_type_id")
    private Category roomTypeId;

    private Boolean excluded;
}
