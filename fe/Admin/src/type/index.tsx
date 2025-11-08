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
export interface AssetFormModalProps{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    category: any[];
    room:any[];
}
export interface UpdateAssetFormModalProps extends AssetFormModalProps {
    assetData: any; // dữ liệu asset cần sửa
}
export interface RoomFormModalProps {
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
export interface StaffFormModalProps{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}
export interface UpdateCategoryFormModalProps extends CategoryFormModalProps {
    categoryData: any; // dữ liệu category cần sửa
}

export interface RoomActionMenuProps {
    room: {
        status?: number;
        [key: string]: any; // Cho phép các field khác (roomCode, name, ...)
    };
    onView?: (room: any) => void;
    onEdit?: (room: any) => void;
    onActivate?: (room: any) => void;
    onDeactivate?: (room: any) => void;
    onMaintenance?: (room: any) => void;
}
export interface AssetActionMenuProps {
    asset: {
        status?:number;
        [key: string]: any;
    }
    onView?: (room: any) => void;
    onEdit?: (room: any) => void;
    onActivate?: (room: any) => void;
    onDeactivate?: (room: any) => void;
    onMaintenance?: (room: any) => void;
}
export interface UpdateExtraServiceFormModalProps extends ExtraServiceFormModalProps {
    serviceData: any; // dữ liệu service cần sửa
}
export interface Category {
    id?: number;
    name?: string;
    description?: string;
    isActive?: boolean;
    [key: string]: any;
}
export interface Staff{
    id?:number;
    fullName?:string;
    isActive?:boolean;
    [key: string]: any;
}
export interface CategoryActionMenuProps {
    category: Category;
    onView?: (category: Category) => void;
    onEdit?: (category: Category) => void;
    onActivate?: (category: Category) => void;
    onDeactivate?: (category: Category) => void;
}
export interface ExtraService {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    isActive?: boolean;
    [key: string]: any;
}

export interface ExtraServiceActionMenuProps {
    service: ExtraService;
    onView?: (service: ExtraService) => void;
    onEdit?: (service: ExtraService) => void;
    onActivate?: (service: ExtraService) => void;
    onDeactivate?: (service: ExtraService) => void;
}
export interface StaffActionMenuProps {
    staff: Staff;
    onActivate?: (service: ExtraService) => void;
    onDeactivate?: (service: ExtraService) => void;
}