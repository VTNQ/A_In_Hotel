package org.a_in_hotel.be.Enum;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CategoryType {
    ROOM(1),
    SERVICE(2),
    ASSET(3);

    private final int value;

    CategoryType(int value) {
        this.value = value;
    }

    @JsonValue
    public int toValue() {
        return value;
    }

    @JsonCreator
    public static CategoryType fromValue(Integer value) {
        if (value == null) return null;
        for (CategoryType type : CategoryType.values()) {
            if (type.value == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown CategoryType value: " + value);
    }
}
