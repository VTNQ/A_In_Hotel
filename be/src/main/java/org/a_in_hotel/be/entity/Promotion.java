package org.a_in_hotel.be.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.a_in_hotel.be.Enum.HotelStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "promotion")
@NoArgsConstructor
@AllArgsConstructor
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name")
    private String name;
    private String code;
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "type")
    private Integer type;
    @Column(name = "value")
    private BigDecimal value;
    @Column(name = "priority")
    private Integer priority;

    private Boolean isActive;

    private LocalDate startDate;

    private LocalDate endDate;
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") // XXX = +07:00
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private OffsetDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @OneToMany(mappedBy = "promotion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PromotionRoomType> roomTypes = new ArrayList<>();

    @OneToOne(mappedBy = "promotion", cascade = CascadeType.ALL)
    private PromotionBookingCondition bookingCondition;



    @OneToOne(mappedBy = "promotion", cascade = CascadeType.ALL)
    private PromotionCustomerCondition customerCondition;

    @PrePersist
    public void onPrePersist() {
        if(this.code == null){
            this.code = "PR" + String.format("%04d", (int) (Math.random() * 9999));
        }
        if(isActive == null){
            this.isActive = true;
        }
    }

}
