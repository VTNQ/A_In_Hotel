export interface Booking {
    step: number;
    guest: any;
    selectDate: any;
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
  INDIVIDUAL: "INDIVIDUAL",
  COMPANY: "COMPANY",
  VIP: "VIP",
} as const;

export type GuestType = typeof GuestType[keyof typeof GuestType];

export const GUEST_TYPE_OPTIONS = [
  { label: "Cá nhân", value: GuestType.INDIVIDUAL },
  { label: "Công ty", value: GuestType.COMPANY },
  { label: "VIP", value: GuestType.VIP },
];

export interface BookingDateTime {
  checkInDate?: string;
  checkOutDate?: string;
  checkInTime?: string;
  checkOutTime?:string;
  package?:string;
  adults:number;
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
