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
@Table(name = "room_switch_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomSwitchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id",nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_room_id",nullable = false)
    private Room fromRoomId;

    @Column(name = "from_room_number",nullable = false)
    private String fromRoomNumber;

    @Column(name = "from_room_name")
    private String fromRoomName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_room_id",nullable = false)
    private Room toRoomId;

    @Column(name = "to_room_number",nullable = false)
    private String toRoomNumber;

    @Column(name = "to_room_name")
    private String toRoomName;

    @Column(name = "reason")
    private String reason;

    @Column(name = "oldPrice")
    private BigDecimal oldPrice;

    @Column(name = "newPrice")
    private BigDecimal newPrice;

    @Column(name = "additionalPrice")
    private BigDecimal additionalPrice;

    @Column(name = "switched_at",nullable = false)
    @CreationTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    private OffsetDateTime switchedAt;

    @Column(name = "switched_by")
    private String switchedBy;
}
