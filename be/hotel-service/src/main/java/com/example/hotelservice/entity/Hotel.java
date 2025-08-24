package com.example.hotelservice.entity;

import com.example.hotelservice.Enum.HotelStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "hotels")
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
    @Column(nullable = false,unique = true,length = 50)
    private String code;
    @Column(columnDefinition = "TEXT",nullable = true)
    private String address;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HotelStatus status= HotelStatus.ACTIVE;
    @Column(nullable = false)
    private Long idUser;
    @Column(nullable = false,updatable = false)
    private Instant createdAt=Instant.now();
    private Instant updatedAt=Instant.now();
    @PreUpdate void onUpdate()
    {
        updatedAt = Instant.now();
    }

}
