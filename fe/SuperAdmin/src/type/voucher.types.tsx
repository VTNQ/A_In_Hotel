import type { StatusFilter } from "./hotel.types";

export const VOUCHER_TYPE: Record<number, string> = {
  1: "voucher.typeView.fixed",
  2: "voucher.typeView.percent",
  3: "voucher.typeView.special",
};
export const BOOKING_TYPE: Record<number, string> = {
  1: "bookingDateTime.packageDayUse",
  2: "bookingDateTime.packageOvernight",
  3: "bookingDateTime.packageFullDay",
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
  roomTypeId: string;
  excluded: boolean;
}
export interface ViewVoucherProps {
  isOpen: boolean;
  onClose: () => void;
  voucherId: any;
}
export interface voucherFormProps {
  voucherCode: string;
  voucherName: string;
  type: string | null;
  description: string;
  value: string;
  maxDiscountValue: string;
  bookingType: string |  null;
  minimumStay: string;
  customerType: number;
  usageType: number;
  usageLimit: string;
  usagePerCustomer: string;
  startDate?: Date ;
  endDate?: Date;
  stackWithPromotion: boolean;
  stackWithOtherVoucher: boolean;
  priority: string;
  roomTypes: voucherRoomType[];
}
export interface VoucherFilterProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (v: StatusFilter) => void;
}
export interface VoucherTableProps {
  rows: Voucher[];
  loading: boolean;
  sortKey: keyof Voucher | null;
  sortDir: "asc" | "desc";
  onSortChange: (key: keyof Voucher) => void;
  onEdit?: (row: Voucher) => void;
  onView?: (row: Voucher) => void;
  onDiabled?: (row: Voucher) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}
export interface voucherRoomType{
  roomTypeId:string;
  roomTypeName:string;
  excluded:boolean;
}
export interface Voucher {
  id: number;
  voucherCode: string;
  voucherName: string;
  type: number;
  description: string;
  value: number;
  maxDiscountValue: number;
  bookingType: number;
  minimumStay: number;
  customerType: number;
  usageType: number;
  usageLimit: number;
  usagePerCustomer: number;
  startDate: string;
  endDate: string;
  stackWithPromotion: boolean;
  stackWithOtherVoucher: boolean;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  roomTypes: voucherRoomType[];
  updatedBy: string;
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
  ALL: 0,
  PERSONAL: 1,
  COMPANY: 2,
  WALKIN: 3,
  ONLINE: 4,
  VIP: 5,
};
export const CUSTOMER_TYPE_OPTIONS = [
  { value: CUSTOMER_TYPE.ALL, labelKey: "common.all" },
  { value: CUSTOMER_TYPE.PERSONAL, labelKey: "voucher.customerType.personal" },
  { value: CUSTOMER_TYPE.COMPANY, labelKey: "voucher.customerType.company" },
  { value: CUSTOMER_TYPE.WALKIN, labelKey: "voucher.customerType.walkin" },
  { value: CUSTOMER_TYPE.ONLINE, labelKey: "voucher.customerType.online" },
  { value: CUSTOMER_TYPE.VIP, labelKey: "voucher.customerType.vip" },
];

export const USAGE_TYPE = {
  ONE_TIME: 1,
  MULTIPLE_TIME: 2,
};

export const USAGE_TYPE_OPTIONS = [
  { value: USAGE_TYPE.ONE_TIME, labelKey: "voucher.usageType.oneTime" },
  { value: USAGE_TYPE.MULTIPLE_TIME, labelKey: "voucher.usageType.multiTime" },
];
