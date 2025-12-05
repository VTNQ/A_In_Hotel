package org.a_in_hotel.be.Enum;

public enum BookingPackage {

    FIRST_2_HOURS(1),
    OVERNIGHT(2),
    FULL_DAY(3);

    private final int code;

    BookingPackage(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }
    public static BookingPackage getBookingPackage(int code) {
        for (BookingPackage bookingPackage : BookingPackage.values()) {
            if (bookingPackage.getCode() == code) {
                return bookingPackage;
            }
        }
        throw new IllegalArgumentException("No enum const BookingPackage from code " + code);
    }
}
