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
    onChange?: (value: RoomGuestValue)=>void;
}