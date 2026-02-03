import type { StatusFilter } from "./hotel.types";

export interface PromotionTypeResponse {
  roomTypeId: number;
  roomTypeName: string;
  excluded: boolean;
}
export interface PromotionFilterProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (v: StatusFilter) => void;
}
export interface Promotion {
  id: number;
  name: string;
  type: number;
  value: number;
  description: string;
  code: string;
  priority: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  bookingType: number;
  minNights: number;
  customerType: number;
  promotionRoomTypeResponses: PromotionTypeResponse[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
export interface PromotionTableProps {
  rows: Promotion[];
  loading: boolean;
  sortKey: keyof Promotion | null;
  sortDir: "asc" | "desc";
  onSortChange: (key: keyof Promotion) => void;
  onEdit?: (row: Promotion) => void;
  onView?: (row: Promotion) => void;
  onDiabled?: (row: Promotion) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}
export interface ViewPromotionProps {
  isOpen: boolean;
  onClose: () => void;
  promotionId: any;
}
export interface UpdatePromotionModalProps {
  open: boolean;
  promotionId: number | null;
  onClose: () => void;
  onSubmit: () => void;
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
  {value:CUSTOMER_TYPE.PERSONAL,labelKey:"promotion.customerType.personal"},
  {value:CUSTOMER_TYPE.COMPANY,labelKey:"promotion.customerType.company"},
  {value:CUSTOMER_TYPE.WALKIN,labelKey:"promotion.customerType.walkin"},
  {value:CUSTOMER_TYPE.ONLINE,labelKey:"promotion.customerType.online"},
  {value:CUSTOMER_TYPE.VIP,labelKey:"promotion.customerType.vip"},
]
export interface RoomTypes {
  id: number;
  excluded: boolean;
}
export interface CreateOrUpdateTabProps {
  formData: PromotionForm;
  setFormData: React.Dispatch<React.SetStateAction<PromotionForm>>;
}
export interface PromotionForm {
  name: string;
  description: string;
  type: string | null;
  value: string;
  priority: string;
  startDate?: Date;
  endDate?: Date;
  bookingType: number;
  minNights: string;
  customerType: string | null;

  roomTypes: RoomTypes[];
}
export const BOOKING_TYPE = {
  HOURLY: 1,
  DAILY: 2,
  MONTHLY: 3,
} as const;
export const BOOKING_TYPE_OPTIONS = [
  { value: BOOKING_TYPE.HOURLY, labelKey: "bookingDateTime.packageDayUse" },
  { value: BOOKING_TYPE.DAILY, labelKey: "bookingDateTime.packageOvernight" },
  { value: BOOKING_TYPE.MONTHLY, labelKey: "bookingDateTime.packageFullDay" },
] as const;
export const TABS = ["general", "offer", "targeting"] as const;
export type TabType = (typeof TABS)[number];
export const PROMOTION_TYPE_I18N: Record<number, string> = {
  1: "promotion.typeView.percent",
  2: "promotion.typeView.fixed",
  3: "promotion.typeView.special",
};
export interface PromotionActionMenuProps {
  promotion:Promotion,
  onView?:(promotion:Promotion)=>void;
  onEdit?:(promotion:Promotion)=>void;
  onDiabled?:(promotion:Promotion)=>void;

}