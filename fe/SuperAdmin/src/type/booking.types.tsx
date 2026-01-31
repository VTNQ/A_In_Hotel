import type { TFunction } from "i18next";
export const BookingStep = {
  GuestInfo: 1,
  DateTime: 2,
  Room: 3,
  Services: 4,
  Payment: 5,
} as const;

export type BookingStep = (typeof BookingStep)[keyof typeof BookingStep];

export interface BookingStepProps {
  currentStep: number;
}
export interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
}
export interface Booking {
  step: number;
  hotelId?: string;
  guest: {
    adults?: number;
    children?: number;
  };
  selectDate: {
    checkInDate?: string;
    checkOutDate?: string;
    nights?: number;
    days?: number;
    package?: string;
  };
  services: any[];
  rooms: any[];
  payment: any;
}
export const GuestType = {
  INDIVIDUAL: "1",
  COMPANY: "2",
  VIP: "3",
} as const;
export const PACKAGE_TIME_MAP: Record<
  string,
  { checkIn: string; checkOut: string }
> = {
  "2": {
    checkIn: "22:00",
    checkOut: "12:00",
  },
  "3": {
    checkIn: "14:00",
    checkOut: "12:00",
  },
};
export type GuestType = (typeof GuestType)[keyof typeof GuestType];
export const getGuestTypeOptions = (t: TFunction) => [
  {
    value: "INDIVIDUAL",
    label: t("booking.guestTypeOptions.individual"),
  },
  {
    value: "COMPANY",
    label: t("booking.guestTypeOptions.company"),
  },
  {
    value: "VIP",
    label: t("booking.guestTypeOptions.vip"),
  },
];
export interface CalendarRangeProps {
  value: {
    start?: string;
    end?: string;
  };
  onChange: (range: { start?: string; end?: string }) => void;
}
export type BookingStatus = 1 | 2 | 3 | 4;
export type BookingStatusFilter = "ALL" | BookingStatus;
export interface BookingDetailResponse{
  id:number;
  bookingId:number;
  roomId:number;
  roomCode:string;
  roomName:string;
  roomNumber:string;
  roomType:string;
  extraServiceName:string;
  specialRequests:string;
  extraServiceId:number;
  price:number;
}
export interface BookingResponse {
  id: number;
  guestName: string;
  note: string;
  surname: string;
  code: string;
  idNumber: string;
  email: string;
  phoneNumber: string;
  totalPrice: number;
  createdAt:string;
  guestType: number;
  numberOfGuests: number;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  BookingPackage: number;
  details:BookingDetailResponse[],
  status: number;
  checkedInAt: string;
  checkedOutAt: string;
}
export const GUEST_TYPE_MAP: Record<number, string> = {
  1: "Regular",
  2: "Member",
  3: "VIP",
};
export interface BookingTableProps {
  rows: BookingResponse[];
  loading: boolean;
  sortKey: keyof BookingResponse | null;
  sortDir: "asc" | "desc";
  onSortChange: (key: keyof BookingResponse) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}
