package org.a_in_hotel.be.Enum;

public enum VoucherType {
    PERCENT(1),
    FIXED(2);
    private final int value;
    public int getValue() {
        return this.value;
    }
    VoucherType(int value) {
        this.value = value;
    }
    public static VoucherType fromValue(int value) {
        for (VoucherType v : values()) {
            if(v.getValue() == value) {
                return v;
            }
        }
        throw new IllegalArgumentException("No VoucherType with value " + value);
    }
}
