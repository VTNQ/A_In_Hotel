export interface DateRange {
  checkIn: string | null;
  checkOut: string | null;
}
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

export const statusLabel = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.BOOKED:
      return "BOOKED";
    case BookingStatus.CHECKIN:
      return "CHECKED IN";
    case BookingStatus.CHECKOUT:
      return "CHECKED OUT";
    case BookingStatus.CANCELLED:
      return "CANCELLED";
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

export interface BookingSearch {
  hotelId?: number;
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  adults?: number;
  children?: number;
  priceRanges?: string[];
  timeTypes?: string[];
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

export type PriceType = "HOURLY" | "OVERNIGHT" | "DAILY";
