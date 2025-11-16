package org.a_in_hotel.be.Enum;

public enum BlogStatus {
    DRAFT(1),
    PUBLISHED(2),
    ARCHIVED(3);
    private final int code;
    BlogStatus(int code){
        this.code = code;
    }
    public int getCode(){
        return this.code;
    }
    public static BlogStatus fromCode(int code){
        for (BlogStatus status : BlogStatus.values()){
            if (status.code == code){
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid Blog Status code " + code);
    }
}
