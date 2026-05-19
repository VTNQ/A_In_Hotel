package org.a_in_hotel.be.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    @NotBlank(message = "Guest name is required")
    @Size(max = 100)
    private String guestName;

    @NotBlank(message = "Surname is required")
    @Size(max = 100)
    private String surname;
    @NotNull(message = "Hotel is required")
    private Long hotelId;
    @NotBlank(message = "ID number is required")
    @Size(min = 6,max = 20)
    private String idNumber;
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[0-9+\\-\\s()]{8,15}$",
            message = "Invalid phone number"
    )
    private String phoneNumber;
    @NotNull(message = "Guest type is required")
    private Integer guestType;
    @Min(value = 1, message = "Number of guests must be greater than 0")
    private Integer numberOfGuests;
    @NotNull(message = "Check-in date is required")
    private LocalDate checkInDate;
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal totalPrice;
    @NotNull(message = "Check-in time is required")
    private LocalTime checkInTime;
    @NotNull(message = "Check-out date is required")
    private LocalDate checkOutDate;
    @NotNull(message = "Check-out time is required")
    private LocalTime checkOutTime;
    @NotNull(message = "Booking package is required")
    @Min(value = 1, message = "Invalid booking package")
    private Integer BookingPackage;
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal originalAmount;
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal discountAmount;

    private String voucherCode;
    @Size(max = 500)
    private String note;
    @NotEmpty(message = "Booking detail is required")
    @Valid
    private List<BookingDetailRequest> bookingDetail;
    @Valid
    @NotNull(message = "Payment information is required")
    private PaymentRequest payment;

}
