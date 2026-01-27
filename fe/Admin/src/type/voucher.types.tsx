export const VOUCHER_TYPE: Record<number, string> = {
  1: "voucher.typeView.percent",
  2: "voucher.typeView.fixed",
  3: "voucher.typeView.special",
};
export interface CreateVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export interface UpdateVoucherModalProps extends CreateVoucherModalProps {
  voucherId: number;
}
export interface voucherRoomType {
  roomTypeId:string;
  excluded:boolean;
}
export interface voucherFormProps {
  voucherCode:string;
  voucherName:string;
  type:string;
  description:string;
  value:string;
  maxDiscountValue:string;
  bookingType:string;
  minimumStay:string;
  customerType:number;
  usageType:number;
  usageLimit:string;
  usagePerCustomer:string;
  startDate:string;
  endDate:string;
  stackWithPromotion:boolean;
  stackWithOtherVoucher:boolean;
  priority:string;
  roomTypes:voucherRoomType[];

}
export interface VoucherActionMenuProps {
  voucher: {
    isActive?: boolean;
    [key: string]: any;
  };
  onView?: (voucher: any) => void;
  onEdit?: (voucher: any) => void;
  onDiabled?: (voucher: any) => void;
}
export const CUSTOMER_TYPE = {
  ALL:0,
  PERSONAL: 1,
  COMPANY: 2,
  WALKIN: 3,
  ONLINE: 4,
  VIP: 5,
}
export const CUSTOMER_TYPE_OPTIONS =[
  {value:CUSTOMER_TYPE.ALL,labelKey:"common.all"},
  {value:CUSTOMER_TYPE.PERSONAL,labelKey:"voucher.customerType.personal"},
  {value:CUSTOMER_TYPE.COMPANY,labelKey:"voucher.customerType.company"},
  {value:CUSTOMER_TYPE.WALKIN,labelKey:"voucher.customerType.walkin"},
  {value:CUSTOMER_TYPE.ONLINE,labelKey:"voucher.customerType.online"},
  {value:CUSTOMER_TYPE.VIP,labelKey:"voucher.customerType.vip"},
]

export const USAGE_TYPE ={
  ONE_TIME:1,
  MULTIPLE_TIME:2,
}

export const USAGE_TYPE_OPTIONS =[
  {value:USAGE_TYPE.ONE_TIME,labelKey:"voucher.usageType.oneTime"},
  {value:USAGE_TYPE.MULTIPLE_TIME,labelKey:"voucher.usageType.multiTime"},
]