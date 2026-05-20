import type { ImageResponse } from ".";
import type { ExtraService } from "./extraService.types";
import type { Room } from "./room.types";
export interface Payment {
  paidAmount: number;
  paymentMethod: string;
  paymentType: number;
  notes: string;
}
export interface bookingListTopResponse{
  bookingCode:string;
  guestName:string;
  roomType:string;
  checkInDate:string;
  roomNumber:string;
  checkInTime:string;
  checkOutDate:string;
  checkOutTime:string;
  status:number;
}
export interface bookingResponse {
  id: number;
  guestName: string;
  note: string;
  surname: string;
  code: string;
  idNumber: string;
  email: string;
  hotelId: number;
  phoneNumber: string;
  guestType: number;
  numberOfGuests: number;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkOutTime: string;
  BookingPackage: number;
  status: number;
  checkedInAt: string;
  checkedOutAt:string;
  payment:Payment[],
  totalPrice:number;
  createdAt:number;
  updatedAt:number;
  details:BookingDetailResponse[];
  roomSwitchHistories:RoomSwitchHistory[];
}
export interface RoomSwitchHistory{
  id:number;
  fromRoomNumber:string;
  fromRoomName:string;
  fromRoomTypeName:string;
  toRoomNumber:string;
  toRoomName:string;
  toRoomTypeName:string;
  reason:string;
  additionalPrice:number;
  switchedAt:string;
  
}
export interface BookingDetailResponse {
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
export interface Booking {
  step: number;
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
  services: ExtraService[];
  rooms: Room[];
  payment: Payment | null;
}
export interface CalendarRangeProps {
  value: {
    start?: string;
    end?: string;
  };
  onChange: (range: { start?: string; end?: string }) => void;
}
export interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
}
export const GuestType = {
  INDIVIDUAL: "1",
  COMPANY: "2",
  VIP: "3",
} as const;

export type GuestType = (typeof GuestType)[keyof typeof GuestType];

export const GUEST_TYPE_OPTIONS = [
  { label: "Cá nhân", value: GuestType.INDIVIDUAL },
  { label: "Công ty", value: GuestType.COMPANY },
  { label: "VIP", value: GuestType.VIP },
];
export const GUEST_TYPE_MAP: Record<number, string> = {
  1: "Regular",
  2: "Member",
  3: "VIP",
};
export interface BookingDateTime {
  checkInDate?: string;
  checkOutDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  package?: string;
  adults: number;
}
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

export interface CheckInBookingResponse {
  open: boolean;
  id: number;
  onCancel: () => void;
  onConfirm: () => void;
}
export interface ViewBookingModalProps {
  open: boolean;
  onClose: () => void;
  id: number;
}
export interface UpdateBookingModalProps {
  open: boolean;
  onClose: () => void;
  id: number;
  onSuccess: () => void;
}
export interface ExtraCharge {
  id?: number | undefined;
  name: string;
  price: number;
  icon?: ImageResponse;
}

export interface ConfirmCheckOutProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  id: number;
}
export interface BookingDetail {
  bookingDetailId: number;
  room: Room;
}
export interface SwitchRoomModalProps {
  open: boolean;
  id: number;
  onClose: () => void;
  onConfirm: () => void;
}
