package org.a_in_hotel.be.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse {

    private Long id;
    private String guestName;
    private String note;

    private String surname;

    private String code;

    private String email;

    private String phoneNumber;

    private Integer guestType;

    private Integer numberOfGuests;

    private LocalDate checkInDate;

    private LocalTime checkInTime;

    private LocalDate checkOutDate;

    private LocalTime checkOutTime;

    private Integer BookingPackage;

    private Integer status;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private OffsetDateTime checkedInAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private OffsetDateTime checkedOutAt;
    private List<PaymentResponse> payment;

    private BigDecimal totalPrice;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private OffsetDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private OffsetDateTime updatedAt;

    private List<BookingDetailResponse> details = new ArrayList<>();

    private List<RoomSwitchHistoryResponse> roomSwitchHistories = new ArrayList<>();


}
