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
}
export interface AssetFormModalProps{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}
export interface BlogFormModalProps{
    isOpen:boolean;
    onClose:()=>void;
    onSuccess:()=>void;
}
export interface UpdateBlogFormModalProps extends BlogFormModalProps{
    blogId:any;
}
export interface UpdateAssetFormModalProps extends AssetFormModalProps {
    assetId: any; // dữ liệu asset cần sửa
}
export interface RoomFormModalProps {
    isOpen: boolean;
    onClose: () => void;    
    onSuccess: () => void;

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
    categoryId: any; // dữ liệu category cần sửa
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
export interface BlogActionMenuProps{
    blog:{
        status?:number;
        [key:string]:any;
    }
    onView?:(blog:any)=>void;
    onEdit?:(blog:any)=>void;
    onPublish?:(blog:any)=>void;
    onArchive?:(blog:any)=>void;
    onRestore?:(blog:any)=>void
}
export interface UpdateExtraServiceFormModalProps extends ExtraServiceFormModalProps {
    serviceId: any; // dữ liệu service cần sửa
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
export interface ViewRoomManagementProps{
    isOpen:boolean;
    onClose:()=>void;
    roomId:any;
}
export interface TabItem {
    key: string;
    label: string;
}
export interface CommonModalViewProps{
    isOpen:boolean;
    title?:string;
    children:React.ReactNode;
    onClose:()=>void;
    tabs?:TabItem[];
    activeTab?:string;
    onTabChange?:(key:string)=>void;
    width?:string;
    isBorderBottom?: boolean;
    widthClose?:string;
    withCenter?:string;

}
export interface ViewAssetProps{
    isOpen:boolean;
    onClose:()=>void;
    assetId:any;
}
export interface ViewBlogProps{
    isOpen:boolean;
    onClose:()=>void;
    blogId:any;
}
export interface ViewCategoryProps{
    isOpen:boolean;
    onClose:()=>void;
    categoryId:any;
}