package org.a_in_hotel.be.Enum;

public enum Gender {
    MALE(0,"Nam"),
    FEMALE(1,"Nữ");
    private final  int code;
    private final String description;
    Gender(int code, String description) {
        this.code = code;
        this.description = description;
    }
    public String getDescription() {
        return description;
    }
    public static Gender fromCode(int code) {
        for (Gender gender : Gender.values()) {
            if (gender.code == code) {
                return gender;
            }

        }
        throw new IllegalArgumentException("Invalid Gender code: " + code);
    }
}