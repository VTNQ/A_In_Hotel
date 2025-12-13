package org.a_in_hotel.be.Enum;

public enum PaymentType {
    DEPOSIT(1),    // Trả cọc
    PARTIAL(2),    // Trả một phần
    FULL(3),       // Trả đủ
    REFUND(4);      // Hoàn tiền (nếu có)

    private final int value;
    PaymentType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static PaymentType fromValue(int value) {
        for (PaymentType paymentType : PaymentType.values()) {
            if (paymentType.getValue() == value) {
                return paymentType;
            }
        }
        throw new IllegalArgumentException("No constant with value " + value + " found in paymentType.");
    }


}
