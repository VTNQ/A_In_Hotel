package org.a_in_hotel.be.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.a_in_hotel.be.Enum.Gender;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "account",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_accounts_email", columnNames = "email")
        }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin Account và Profile User")
public class Account implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Id account", example = "123")
    private Long id;

    @Schema(description = "Mật khẩu của Account",nullable = true)
    @Column(nullable = false)
    private String password;

    @Schema(description = "Email của Account", example = "abc@gmail.com")
    @Column(nullable = false, unique = true)
    private String email;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    @Schema(description = "Tên đầy đủ", example = "Trần Nguyễn Thanh Phong")
    private String fullName;

    @Schema(description = "Avatar của Account", example = "http://localhost:8083/v3/api-docs")
    private String avatarUrl;

    @Schema(description = "Số điện thoại", example = "0924517309")
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    @Schema(description = "Giới tính", example = "Male")
    private Gender gender;

    @Schema(description = "Ngày sinh", example = "2003-07-22")
    private LocalDate birthday;

    @Schema(description = "Thời gian tạo", example = "2025-08-22 09:05:46.698643")
    private LocalDateTime createdAt;

    @Schema(description = "Thời gian cập nhật", example = "2025-08-22 09:05:46.698643")
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

    // UserDetails methods
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(() -> "ROLE_" + role.getName());
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
