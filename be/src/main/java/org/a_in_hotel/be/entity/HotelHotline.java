package org.a_in_hotel.be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hotel_hotlines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelHotline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,length = 20)
    private String phone;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "hotel_id",nullable = false)
    private Hotel hotel;
}
