package org.a_in_hotel.be.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.a_in_hotel.be.Enum.Gender;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
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
@Schema(description = "Thông tin tài khoản đăng nhập")
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
    @OneToOne(mappedBy = "account", fetch = FetchType.LAZY)
    private Hotel hotel;
    @OneToOne(mappedBy = "account", fetch = FetchType.LAZY)
    private Staff staff;

    @Transient
    private Image image;

    @CreationTimestamp
    @Schema(description = "Thời gian tạo", example = "2025-08-22 09:05:46.698643")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Schema(description = "Thời gian cập nhật", example = "2025-08-22 09:05:46.698643")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssXXX")
    private OffsetDateTime updatedAt;
    @Column(name = "is_active")
    private Boolean isActive = true;
    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

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
