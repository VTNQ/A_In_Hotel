package org.a_in_hotel.be.Enum;

public enum GuestType {

    PERSONAL(1,"Regular"),
    COMPANY(2,"Member"),
    VIP(3,"Vip");

    private final int code;

    private final String description;

    GuestType(int code,String description) {
        this.code = code;
        this.description = description;
    }
    public String getDescription() {
        return description;
    }

    public int getCode() {
        return code;
    }
    public static GuestType fromCode(int code) {
        for (GuestType guestType : GuestType.values()) {
            if (guestType.code == code) {
                return guestType;
            }
        }
        throw new IllegalArgumentException("No enum const GuestType from code " + code);
    }
}
