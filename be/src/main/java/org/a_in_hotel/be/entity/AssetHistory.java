package org.a_in_hotel.be.entity;

import jakarta.persistence.*;
import lombok.*;
import org.a_in_hotel.be.Enum.AssetStatus;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "asset_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // CREATE / UPDATE / STATUS_CHANGE / TOGGLE_DEACTIVATED / ASSIGN_ROOM / UNASSIGN_ROOM
    @Column(nullable = false, length = 50)
    private String action;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Enumerated(EnumType.STRING)
    private AssetStatus oldStatus;

    @Enumerated(EnumType.STRING)
    private AssetStatus newStatus;

    private Long oldRoomId;
    private Long newRoomId;

    @Column(columnDefinition = "TEXT")
    private String note;

    private String changedBy;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
