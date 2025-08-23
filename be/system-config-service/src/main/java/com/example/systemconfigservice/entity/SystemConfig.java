package com.example.systemconfigservice.entity;

import com.example.systemconfigservice.Enum.SystemConfigType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "system_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "config_key", length = 255, nullable = false)
    private String key;
    @Column(name = "config_value", length = 255, nullable = false)
    private String value;
    @Enumerated(EnumType.STRING)
    @Column(name = "config_type", nullable = false, length = 32)
    private SystemConfigType type;
    @Column(nullable = false,updatable = false)
    private Instant createdAt=Instant.now();
    private Instant updatedAt=Instant.now();
    @PreUpdate void onUpdate()
    {
        updatedAt = Instant.now();
    }
}
