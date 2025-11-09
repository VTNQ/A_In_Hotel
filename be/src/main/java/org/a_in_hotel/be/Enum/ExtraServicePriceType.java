package org.a_in_hotel.be.Enum;

public enum ExtraServicePriceType {
    FIXED(1,"Fixed Amount"),
    PERCENTAGE_ROOM(2,"% of Room Price");
    private final int code;
    private final String description;
    ExtraServicePriceType(int code, String description) {
        this.code = code;
        this.description = description;
    }
    public int getCode() {
        return code;
    }
    public String getDescription() {
        return description;
    }
    public static ExtraServicePriceType fromCode(int code){
        for(ExtraServicePriceType st : values()){
            if(st.getCode()==code){
                return st;
            }
        }
        throw new IllegalArgumentException("Invalid Extra Service code: " + code);
    }
    }
