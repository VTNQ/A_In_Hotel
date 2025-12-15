import type { FacilityStatus } from "@/setting/constant/Facility.constant";
import type { ImageResponse } from "./common";
import type { StatusFilter } from "./hotel.types";

export interface facilityRow{
    id:number;
    serviceCode?:string;
    serviceName:string;
    description:string;
    note:string;
    categoryName:string;
    extraCharge:number;
    categoryId?:number;
    price:number;
    unit:string;
    icon:ImageResponse
    isActive:FacilityStatus;
    createdAt:string;
    updatedAt:String
}
export interface FacilityFilterProps {

    search: string;
    onSearchChange: (v: string) => void;
    statusFilter: StatusFilter;
    onStatusFilterChange: (v: StatusFilter) => void;
}

export interface FacilitiesEditProps{
    open:boolean;
    facilityId:number | null;
    onClose: ()=>void;
    onSubmit:()=>void;
}

export interface FacilityForm {
    serviceName:string;
    note:string;
    description:string;
    categoryId:string | null;

}
export interface FacilityTableProps {
    rows:facilityRow[];
    sortKey:keyof facilityRow | null;
    sortDir: "asc" | "desc";
    onSortChange: (key: keyof facilityRow) => void;
    loading:boolean;
    onEdit:(row:facilityRow)=>void;
    onStatusChange:(row:facilityRow,status:FacilityStatus)=>void;
}