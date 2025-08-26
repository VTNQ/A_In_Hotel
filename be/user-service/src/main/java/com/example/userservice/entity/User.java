package com.example.userservice.entity;


import com.example.commonutils.Enum.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin Profile User")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Id profile của User",example = "123")
    private Long id;
    @Schema(description = "Id account",example = "123")
    @Column(nullable = false,unique = true)
    private Long accountId;
    @Schema(description = "Tên Account",example = "Trần Nguyễn Thanh Phong")
    private String fullName;
    @Schema(description = "Avatar của Account",example = "http://localhost:8083/v3/api-docs")
    private String avatarUrl;
    @Schema(description = "Số điện thoại của Account",example = "0924517309")
    private String phone;
    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    @Schema(description = "Giới tính của User",example = "Male")
    private Gender gender;
    @Schema(description = "Ngày sinh của User",example = "2003-07-22")
    private LocalDate birthday;
    @Schema(description = "Thời gian tạo",example = "2025-08-22 09:05:46.698643")
    private LocalDateTime createdAt;
    @Schema(description = "Thời gian cập nhật",example = "2025-08-22 09:05:46.698643")
    private LocalDateTime updatedAt;
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = createdAt;
    }
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
