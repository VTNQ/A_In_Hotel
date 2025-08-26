package com.example.bannerservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String slug;
    private String name;
    @ManyToMany(mappedBy = "categories")
    @JsonIgnore
    private List<Banner> banners=new ArrayList<>();
    @Column(nullable = false,updatable = false)
    private Instant createdAt=Instant.now();
    private Instant updatedAt=Instant.now();
    @PreUpdate void onUpdate()
    {
        updatedAt = Instant.now();
    }
}
