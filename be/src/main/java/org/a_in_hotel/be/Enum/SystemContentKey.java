package org.a_in_hotel.be.Enum;

public enum SystemContentKey {
    ABOUT_SYSTEM(1),        // About Our Hotel (global)
    HOME_HERO(2),           // Hero section trang home
    HOME_ABOUT(3),          // About section trang home
    FOOTER_CONTENT(4);      // Footer content

    private final int value;

    SystemContentKey(int value) {
        this.value =value;
    }

    public static SystemContentKey fromValue(int value) {
        for (SystemContentKey systemContentKey : SystemContentKey.values()) {
            if (systemContentKey.value == value) {
                return systemContentKey;
            }
        }
        throw new IllegalArgumentException("No enum const SystemContentKey from value " + value);
    }
}
