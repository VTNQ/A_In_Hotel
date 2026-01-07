import type { ImageResponse } from ".";
import type { Room } from "./room.types";

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
  services: any[];
  rooms: any[];
  payment: any;
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

export type GuestType = typeof GuestType[keyof typeof GuestType];

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
export const PACKAGE_TIME_MAP: Record<string, { checkIn: string; checkOut: string }> = {
  "2": {
    checkIn: "22:00",
    checkOut: "12:00",
  },
  "3": {
    checkIn: "14:00",
    checkOut: "12:00",
  },
};
export interface bookingResponse {
  guest: {
    name: string;
    adults: number;
    notes?: string;
  }
  rooms: {
    id: string | number;
    name: string;
    type: string;
  }[];
  date: {
    checkIn: string;
    checkOut: string;
    nights: number;
  };
  payment: {
    total: number;
    paid: number;
    outstanding: number;
    currency?: string;
  };
}
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
  open:boolean;
  onClose:()=>void;
  id:number;
  onSuccess:()=>void;
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
 id:number;
    onClose: () => void;
    onConfirm:()=>void;

   
}