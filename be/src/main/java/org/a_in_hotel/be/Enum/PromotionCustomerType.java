package org.a_in_hotel.be.Enum;

public enum PromotionCustomerType {
    ALL(0),
    PERSONAL(1),
    COMPANY(2),
    WALKIN(3),
    ONLINE(4),
    VIP(5);

    private final  int code;

    PromotionCustomerType(int code){
        this.code = code;
    }

    public int getCode(){
        return  this.code;
    }

    public static PromotionCustomerType fromValue(int value){
        for (PromotionCustomerType type : values()){
            if(type.getCode() == value){
                return type;
            }
        }
        throw new IllegalArgumentException("No constant with value "+value+" found in promotion customer type.");
    }
}
