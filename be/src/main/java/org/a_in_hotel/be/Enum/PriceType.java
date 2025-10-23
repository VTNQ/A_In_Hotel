package org.a_in_hotel.be.Enum;

import lombok.Getter;

@Getter
public enum PriceType {
    HOURLY(1),
    OVERNIGHT(2);

    private final int code;

    PriceType(int code) {
        this.code = code;
    }

    public static PriceType fromCode(int code) {
        for (PriceType type : PriceType.values()) {
            if (type.code == code) return type;
        }
        throw new IllegalArgumentException("Invalid PriceType code: " + code);
    }
}
