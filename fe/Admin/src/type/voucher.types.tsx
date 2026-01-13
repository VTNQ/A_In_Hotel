export interface VoucherFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}
export interface Voucher {
    id?:number;
    voucherName?:string;
    discountType?:string;
     [key: string]: any;
}
export interface VoucherActionMenuProps {
    voucher:Voucher;
    onEdit?:(voucher:Voucher)=>void;
    onActivate?:(voucher:Voucher)=>void;
    onDeactivate?:(voucher:Voucher)=>void;
}

export interface UpdateVoucherFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    voucherId: number | null;
}