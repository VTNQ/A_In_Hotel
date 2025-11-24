package org.a_in_hotel.be.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Entity
@Table(name = "staff")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin hồ sơ nhân viên trong khách sạn")
public class Staff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Id nhân viên (PK)",example = "10")
    private Long id;
    @Column(unique = true,nullable = false)
    @Schema(description = "Mã nhân viên",example = "ST01")
    private String staffCode;
    @Schema(description = "Họ và tên nhân viên",example = "Trần Nguyễn Thanh Phong")
    private String fullName;
    @Schema(description = "Ngày sinh", example = "2003-02-01")
    private LocalDate birthday;
    @Column(name = "gender")
    @Schema(description = "Ngày sinh",example = "2003-02-01")
    private Integer gender;
    @Schema(description = "Số điện thoại",example = "01234567")
    private String phone;
    @OneToOne
    @JoinColumn(name = "account_id")
    @Schema(description = "Tài khoản đăng nhập liên kết với nhân viên")
    private Account account;
    @Schema(description = "Thời gian tạo", example = "2025-08-22 09:05:46.698643")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    @CreationTimestamp
    private OffsetDateTime createdAt;
    @Schema(description = "Thời gian cập nhật", example = "2025-08-22 09:05:46.698643")
    @UpdateTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    private OffsetDateTime updatedAt;
    @Column(name = "hotel_id")
    private Long hotelId;
    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;
    @PrePersist
    public void prePersist() {
        if (this.staffCode == null || this.staffCode.isEmpty()) {
            this.staffCode = "ST" + String.format("%04d", (int) (Math.random() * 9999));
        }
    }

}
