
export const HOTEL_STATUS = {
    INACTIVE: 0,
    ACTIVE: 1,
} as const;

export type HotelStatus =
    (typeof HOTEL_STATUS)[keyof typeof HOTEL_STATUS];

export const HOTEL_STATUS_OPTIONS = [
    { value: HOTEL_STATUS.ACTIVE, label: "Hoạt động" },
    { value: HOTEL_STATUS.INACTIVE, label: "Không hoạt động" },
];