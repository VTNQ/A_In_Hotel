package org.a_in_hotel.be.Enum;

public enum DiscountType {

    PERCENT(1),
    FIXED(2),
    SPECIAL(3);
    private final int code;

    public int getCode(){
        return code;
    }
    DiscountType(int code){
        this.code = code;
    }

    public static DiscountType fromCode(int code){
        for (DiscountType status : DiscountType.values()){
            if(status.code == code){
                return status;
            }
        }
        throw new  IllegalArgumentException("Invalid discount type code:"+code);
    }
}
