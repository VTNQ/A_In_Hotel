package org.a_in_hotel.be.entity;

import jakarta.persistence.*;
import lombok.*;
import org.a_in_hotel.be.Enum.HotelStatus;

import java.time.Instant;

@Entity
@Table(
        name = "hotels",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_hotels_code", columnNames = "code"),
                @UniqueConstraint(name = "uk_hotels_account", columnNames = "account_id"),
                @UniqueConstraint(name = "uk_hotels_name", columnNames = "name")
        }
)
@Getter
@Setter
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 200)
    private String name;
    @Column(nullable = false, unique = true, length = 50)
    private String code;
    @Column(columnDefinition = "TEXT", nullable = true)
    private String address;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HotelStatus status = HotelStatus.ACTIVE;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false, unique = true) // Tạo cột account_id trong bảng hotels
    private Account account;
    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    @Column(name = "created_by")
    private String createdBy;
    @Column(name = "updated_by")
    private String updatedBy;
}
