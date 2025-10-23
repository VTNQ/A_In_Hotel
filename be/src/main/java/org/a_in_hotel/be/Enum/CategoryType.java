package org.a_in_hotel.be.Enum;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CategoryType {
    ROOM, SERVICE, ASSET;

    // Nhận "room", "Room", "ROOM" đều OK
    @JsonCreator
    public static CategoryType from(String value) {
        if (value == null) return null;
        return CategoryType.valueOf(value.trim().toUpperCase());
    }

    // Trả ra "Room", "Service", "Asset" cho đẹp khi serialize JSON
    @JsonValue
    public String toJson() {
        String s = name().toLowerCase();
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }
}
