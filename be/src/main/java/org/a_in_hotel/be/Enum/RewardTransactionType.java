package org.a_in_hotel.be.Enum;

public enum RewardTransactionType {
    EARN(1),
    REDEEM(2),
    EXPIRE(3);
    private final Integer code;
    RewardTransactionType(int code){
        this.code =code;
    }
    public static RewardTransactionType fromCode(Integer code){
        for (RewardTransactionType t:values()){
            if (t.code == code) return t;
        }
        throw new IllegalArgumentException("Invalid reward transaction type code: " + code);
    }
}
