package org.a_in_hotel.be.Enum;

public enum ServiceType {

    FACILITY(1),
    EXTRA_SERVICE(2);
    private final int code;
    ServiceType(int code) {
        this.code = code;
    }
    public int getCode() {
        return code;
    }

    public static ServiceType fromCode(int code) {
        for (ServiceType type : ServiceType.values()) {
            if (type.getCode() == code) {
                return type;
            }
        }
        throw new IllegalArgumentException("No enum constant with code " + code);
    }
}
