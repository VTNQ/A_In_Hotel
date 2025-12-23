package org.a_in_hotel.be.Enum;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum     CategoryType {
    ROOM(1),
    SERVICE(2),
    ASSET(3);

    private final int code;

    CategoryType(int code) {
        this.code = code;
    }

    public static CategoryType fromCode(int code) {
        for (CategoryType t : values()) {
            if (t.code == code) return t;
        }
        throw new IllegalArgumentException("Invalid CategoryType code: " + code);
    }
}
