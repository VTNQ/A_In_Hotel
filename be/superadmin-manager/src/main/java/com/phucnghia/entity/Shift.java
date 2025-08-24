package com.phucnghia.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name = "shifts")
public class Shift {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Ví dụ: MORNING / AFTERNOON / NIGHT */
    @Column(nullable = false, length = 50, unique = true)
    private String code;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(length = 255)
    private String description;

    @OneToMany(mappedBy = "shift")
    private List<WorkAssignment> assignments = new ArrayList<>();
}
