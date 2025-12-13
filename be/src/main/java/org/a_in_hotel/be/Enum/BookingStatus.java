package org.a_in_hotel.be.Enum;

public enum BookingStatus {


    BOOKED(1),
    CHECKIN(2),
    CHECKOUT(3),
    CANCELLED(4);


    private final int code;

    BookingStatus(int code) {
        this.code = code;

    }

    public int getCode() {
        return code;
    }


    public static BookingStatus fromCode(int code) {
        for (BookingStatus status : BookingStatus.values()) {
            if (status.getCode() == code) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid booking code " + code);
    }
}
