package org.a_in_hotel.be.Enum;

public enum PromotionDayType {

    WEEKDAY(1),
    WEEKEND(2),
    HOLIDAY(3),
    ALL(4);
    private final int code;

    PromotionDayType(int code){
        this.code = code;
    }

    public int getCode(){
        return code;
    }

    public static PromotionDayType fromValue(int code){
        for (PromotionDayType type : values()){
            if(type.getCode()==code){
                return type;
            }
        }
        throw new IllegalArgumentException("No constant with value "+code+" found in promotion type");
    }
}
