package org.a_in_hotel.be.Enum;

public enum UsageType {
    SINGLEUSE(1),
    MULTIUSE(2);
    private  final  int code;
    UsageType(int code){
        this.code =code;
    }
    public int getCode(){
        return code;
    }
    public static UsageType fromValue(int value){
        for (UsageType type : values()){
            if(type.code == value){
                return type;
            }
        }
        throw new IllegalArgumentException("No enum const usage type from value "+value);
    }
}
