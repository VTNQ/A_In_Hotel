package org.a_in_hotel.be.Enum;

public enum AssetStatus {
    GOOD(1),
    MAINTENANCE(2),
    BROKEN(3),
    DEACTIVATED(4);
    private final int code;
    public int getCode() {
        return code;
    }
    AssetStatus(int code) {
        this.code = code;
    }
    public static AssetStatus fromCode(int code) {
        for (AssetStatus status : AssetStatus.values()) {
            if (status.code == code) {
                return status;
            }

        }
        throw new IllegalArgumentException("Invalid asset status code: " + code);
    }
}
