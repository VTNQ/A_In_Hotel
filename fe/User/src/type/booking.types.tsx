export interface DateRange {
    checkIn: string | null;
    checkOut: string | null;
}

export interface DateRangeProps {
    value?: DateRange;
    onChange?: (value: DateRange) => void;
}

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
    hotelId: number;
    checkIn: string;
    checkOut: string;
    rooms: number;
    adults: number;
    children: number;
}
export interface BookingSearchContextValue {
    search: BookingSearch | null;
    setSearch: (s: BookingSearch) => void;
  };