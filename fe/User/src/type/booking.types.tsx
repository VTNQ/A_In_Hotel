import { Moon, Sun, Timer } from "lucide-react";

export interface DateRange {
  checkIn: string | null;
  checkOut: string | null;
}
export type TabKey = "UPCOMING" | "COMPLETED" | "CANCELLED";
export const BookingStatus = {
  BOOKED: 1,
  CHECKIN: 2,
  CHECKOUT: 3,
  CANCELLED: 4,
} as const;
export type BookingStatusTab = "BOOKED" | "CHECKIN" | "CHECKOUT" | "CANCELLED";
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
export interface DateRangeProps {
  value?: DateRange;
  onChange?: (value: DateRange) => void;
}
export interface Booking {
  step: number;
  guest: any;
  selectDate: any;
  services: any;
   countdown?: any;
  payment: any;
}
export const BookingSteps = ["Guest Info", "Schedule", "Services", "Payment"];
export const statusLabel = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.BOOKED:
      return "Đã đặt";
    case BookingStatus.CHECKIN:
      return "Đang ở";
    case BookingStatus.CHECKOUT:
      return "Hoàn tất";
    case BookingStatus.CANCELLED:
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};
export const statusStyle = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.BOOKED:
      return "bg-blue-100 text-blue-700";
    case BookingStatus.CHECKIN:
      return "bg-green-100 text-green-700";
    case BookingStatus.CHECKOUT:
      return "bg-purple-100 text-purple-700";
    case BookingStatus.CANCELLED:
      return "bg-red-100 text-red-700";
  }
};
export interface RoomGuestValue {
  rooms: number;
  adults: number;
  children: number;
}

export interface RoomsGuestsSelectProps {
  value?: RoomGuestValue;
  onChange?: (value: RoomGuestValue) => void;
}
export interface  BookingDetailResponse {
  id: number;
  roomName: string;
  roomNumber: string;
  roomType: string;
  price: number;
}
export interface BookingResponse{
   id: number;
  code: string;
  guestName: string;
  phoneNumber: string;
  email: string;
  numberOfGuests: number;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  totalPrice: number;
  status: number;
  details: BookingDetailResponse[];
}
export interface GuestFormData {
  firstName: string;
  lastName: string;
  idNumber: string;
  guestType: string;
  email: string;
  phone: string;
  note: string;
}
export interface BookingSearch {
  hotelId?: number;
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  adults?: number;
  children?: number;
  priceRanges?: string[];
  roomId?: number;
  priceType?: string;
  guestName?: string;
  totalPrice?: number;
}
export interface BookingSearchContextValue {
  search: BookingSearch | null;
  setSearch: (s: BookingSearch) => void;
  clearSearch: () => void;
}
export const BookingPackages = [
  {
    id: "1",
    title: "First 2 Hours",
    desc: "Short stay / Transit",
    icon: Timer,
  },
  {
    id: "2",
    title: "Overnight",
    desc: "Perfect for restful sleep",
    icon: Moon,
  },
  { id: "3", title: "Full Day", desc: "Complete flexibility", icon: Sun },
];
export const TIME_MAP: any = {
  "2": {
    checkIn: "22:00",
    checkOut: "12:00",
  },
  "3": {
    checkIn: "14:00",
    checkOut: "12:00",
  },
};
export type PriceType = "1" | "2" | "3";
