export const PROMOTION_TYPE_I18N: Record<number, string> = {
  1: "promotion.typeView.percent",
  2: "promotion.typeView.fixed",
  3: "promotion.typeView.special",
};
export interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export interface UpdatePromotionModalProps extends CreatePromotionModalProps {
  promotionId: number;
}
export const TABS = ["general", "offer", "targeting"] as const;
export type TabType = (typeof TABS)[number];
export interface RoomTypes {
  id: number;
  excluded: boolean;
}
export interface PromotionForm {
  name: string;
  description: string;
  type: string;
  value: string;
  priority: string;
  startDate: string;
  endDate: string;
  bookingType: number;
  minNights: string;
  customerType: string;

  promotionRoomTypeRequests: RoomTypes[];
}
export interface PromotionResponse {
  id: number;
  name:string;
  type:number;
  value:number;
  description:string;
  code:string;
  priority:number;
  startDate:string;
  endDate:string;
  isActive:boolean;
  bookingType:number;
  minNights:number;
  customerType:number;
  promotionRoomTypeResponses:PromotionRoomTypeResponse[];
  createdAt:string;
  updatedAt:string;
  createdBy:string;
  updatedBy:string;
}
export interface PromotionRoomTypeResponse {
  roomTypeId:number;
  roomTypeName:string;
  excluded:boolean;
}
export interface PromotionActionMenuProps {
  promotion: PromotionResponse;
  onView?: (promotion: PromotionResponse) => void;
  onEdit?: (promotion: PromotionResponse) => void;
  onDiabled?: (promotion: PromotionResponse) => void;
}

export interface CreateOrUpdateTabProps {
 watch:any;
 setValue:any;
 trigger:any;
 errors:any
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
export interface ViewPromotionProps {
  isOpen: boolean;
  onClose: () => void;
  promotionId: any;
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