export const FACILITY_STATUS = {
    INACTIVE: "false",
    ACTIVE: "true",
} as const;

export type FacilityStatus =
(typeof FACILITY_STATUS)[keyof typeof FACILITY_STATUS]; 

export const FACILITY_STATUS_OPTIONS = [
    { value: FACILITY_STATUS.ACTIVE, label: "Hoạt động" },
    { value: FACILITY_STATUS.INACTIVE, label: "Không hoạt động" },
];

export const STATUS_OPTIONS = [
    { value: true, label: "Hoạt động" },
    { value: false, label: "Không hoạt động" },
]
export const STATUS_STYLES: Record<FacilityStatus
, string> = {
    true: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    false: "bg-rose-50 text-rose-700 ring-rose-200",
};
