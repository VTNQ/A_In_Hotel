package com.example.brandservice.entity;

import com.example.brandservice.Enum.BranchStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "branches")
@Getter
@Setter
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Branch {
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
    private BranchStatus status=BranchStatus.ACTIVE;
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
