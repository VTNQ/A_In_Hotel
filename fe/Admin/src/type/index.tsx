import type { LucideIcon } from "lucide-react";

export type GetAllOptions = {
    page?: number;
    size?: number;
    sort?: string;
    filter?: string;
    searchField?: string;
    searchValue?: string
    all?: boolean;
};

export interface MenuItem {
    label: string;
    icon?: LucideIcon,
    path?: string;
    children?: MenuItem[];
}
export interface CommonModalProps {
    isOpen: boolean;
    title?: string;
    children: React.ReactNode,
    onClose: () => void;
    onSave?: () => void;
    saveLabel?: string;
    cancelLabel?: string;
}
export interface ExtraServiceFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    category: any[];
}
export interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}
export interface UpdateCategoryFormModalProps extends CategoryFormModalProps {
    categoryData: any; // dữ liệu category cần sửa
}
export interface ActionHandlers {
    onView?: (rows: any) => void;
    onEdit?: (row: any) => void;
    onActivate?: (row: any) => void;
    onDeactivate?: (row: any) => void;
}
export interface ActionMenuProps extends ActionHandlers {
  row: any;
}
export interface UpdateExtraServiceFormModalProps extends ExtraServiceFormModalProps {
  serviceData: any; // dữ liệu service cần sửa
}