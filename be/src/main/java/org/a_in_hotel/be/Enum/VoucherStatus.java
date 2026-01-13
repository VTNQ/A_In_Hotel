package org.a_in_hotel.be.Enum;

public enum VoucherStatus {
    ACTIVE(1),
    INACTIVE(2);

    private final int value;

    public int getValue(){
        return this.value;
    }

    VoucherStatus(int value){
        this.value = value;
    }

    public static VoucherStatus fromValue(int value){
        for (VoucherStatus status : values()){
            if(status.value == value){
                return  status;
            }
        }
        throw new IllegalArgumentException("No enum const voucher status from value "+value);
    }
}
