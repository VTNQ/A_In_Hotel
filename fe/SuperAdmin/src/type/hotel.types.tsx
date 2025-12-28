
import type { ImageResponse, Status } from "./common";

export interface HotelFormData {
    name: string;
    address: string;
    idUser?: number | null;
    image:null | File;
}


export type StatusFilter = "ALL" | Status;
export type SearchField = "default" | "name" | "code" | "fullName";

export interface HotelRow {
    id: number;
    code?: string;
    name: string;
    createdOn: string | number;
    status: Status;
    address: string;
    thumbnail:ImageResponse;
    fullName?: string;
    idUser: number | null;
}

export interface HotelFilterProps {

    search: string;
    onSearchChange: (v: string) => void;
    statusFilter: StatusFilter;
    onStatusFilterChange: (v: StatusFilter) => void;
}
export interface HotelTableProps {
    rows:HotelRow[];
    loading:boolean;
    onEdit: (row: HotelRow)=>void;
    sortKey: keyof HotelRow | null;
    sortDir: "asc" | "desc";
    onStatusChange:(row:HotelRow,status:Status)=>void;
    onSortChange: (key: keyof HotelRow) => void;
}

export interface HotelEditProps {
    open:boolean;
    hotelId:number | null;
    onClose: ()=>void;
    onSubmit:()=>void;
}