

export type SortDir = "asc" | "desc";
export const STATUS_STYLES: Record<Status
, string> = {
    1: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    0: "bg-rose-50 text-rose-700 ring-rose-200",
};

export const STATUS_OPTIONS = [
    { value: 1, label: "Hoạt động" },
    { value: 0, label: "Không hoạt động" },
]
export type Status = 0 | 1;

export interface ImageResponse {
    url:string;
    altText:string
}
export interface BreadcrumbItem {
    label:string;
    href?:string;
}
export interface BreadcrumbProps {
    items: BreadcrumbItem[];
}