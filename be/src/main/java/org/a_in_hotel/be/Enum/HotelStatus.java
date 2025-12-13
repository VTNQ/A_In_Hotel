package org.a_in_hotel.be.Enum;

public enum HotelStatus {
    ACTIVE(1),
    INACTIVE(2);
    private  final  int value;

     HotelStatus(int value) {
        this.value = value;
    }

    public int getValue() {
         return value;
    }

    public static HotelStatus fromValue(int value) {
         for (HotelStatus status : HotelStatus.values()) {
             if (status.getValue() == value) {
                 return status;
             }
         }
         throw new IllegalArgumentException("Invalid value " + value);
    }
}
