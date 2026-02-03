

export type SortDir = "asc" | "desc";
export const STATUS_STYLES: Record<Status
, string> = {
    1: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    0: "bg-rose-50 text-rose-700 ring-rose-200",
};
export interface PaginationConfig {
    page:number;
    pageSize:number;
    total:number;
    onPageChange:(page:number)=>void;
}
export type DialogSize = "sm" | "md" | "lg" | "xl" | "full"
export interface ToggleProps {
 label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export const sizeClasses: Record<DialogSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
  full: "sm:max-w-[90vw]"
}
export interface TableContextType<SortKey extends string>  {
  sortKey: SortKey | null;
  sortDir: SortDir;
  onSort?: (key: SortKey) => void;
};
export const STATUS_OPTIONS = [
    { value: 1, label: "Active" },
    { value: 0, label: "InActive" },
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

export interface ActionItem {
    label:string;
    icon?:React.ReactNode;
    onClick?:()=>void;
    danger?:boolean;
    disabled?:boolean;
}
export interface ActionMenuProps{
    title?:string;
    actions:ActionItem[];
}