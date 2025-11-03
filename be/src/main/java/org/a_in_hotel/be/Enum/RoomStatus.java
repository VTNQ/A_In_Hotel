package org.a_in_hotel.be.Enum;

public enum RoomStatus {
    VACANTDIRTY(1),
    OCCUPIED(2),
    AVAILABLE(3),
    MAINTENANCE(4),
    BLOCKED(5),
    DEACTIVATED(6);
    private final int code;

    RoomStatus(int code) {
        this.code = code;
    }

    public static RoomStatus fromCode(int code) {
        for (RoomStatus t : values()) {
            if (t.code == code) return t;
        }
        throw new IllegalArgumentException("Invalid room status code: " + code);
    }
}
