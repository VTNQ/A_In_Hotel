package org.a_in_hotel.be.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.a_in_hotel.be.Enum.RoomStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    @Column(name = "id", length = 10)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "room_code", nullable = false, unique = true, length = 50)
    private String roomCode;
    @Column(name = "room_number",nullable = false)
    private String roomNumber;
    @Column(name = "hotel_id")
    private Long hotelId;
    @Column(name = "room_name")
    private String roomName;
    @Column(name = "base_price",nullable = false)
    private BigDecimal basePrice;
    @Column(name = "additional_price")
    private BigDecimal additionalPrice;
    @Column(name = "overnight_price")
    private BigDecimal overnightPrice;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id",nullable = false)
    private Category roomType;
    @Column(name = "status",nullable = false)
    private Integer status;
    @Column(name = "default_rate")
    private BigDecimal defaultRate;
    @Column(name = "floor")
    private Integer floor;
    @Column(name = "capacity")
    private Integer capacity;
    @Column(name = "area")
    private Double area;
    @Column(name = "note")
    private String note;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX") // XXX = +07:00
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    private OffsetDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "entity_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<Image> images = new ArrayList<>();
    @PrePersist
    public void prePersist() {
        if(this.roomCode == null || this.roomCode.isEmpty()) {
            this.roomCode = "A" + String.format("%04d", (int) (Math.random() * 9999));
        }
    }

}
