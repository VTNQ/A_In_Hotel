import type { StatusFilter } from "./hotel.types";
export interface AccountStaff {
  id:number;
}
export interface Staff {
  id: number;
  email: string;
  fullName: string;
  staffCode: string;
  gender: string;
  birthday: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  account:AccountStaff;
  isActive?: boolean;
  role:string;
}
export interface StaffForm {
  email:string;
  fullName:string;
  gender:string;
  phone:string;
  birthday?:Date;
  idRole:string | null;
  hotelId:string | null;
}
export interface StaffFilterProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (v: StatusFilter) => void;
  onHotelFilterChange: (v: string) => void;
  hotelFilter: string;
}
export interface StaffActionMenuProps {
  staff:Staff;
  onActive?: (staff: Staff) => void;
  onInActive?: (staff: Staff) => void;
}
export interface StaffTableProps {
  rows: Staff[];
  loading: boolean;
  sortKey: keyof Staff | null;
  sortDir: "asc" | "desc";
  onSortChange: (key: keyof Staff) => void;
  page: number;
  pageSize: number;
  total: number;
  onActive: (row: Staff) => void;
  onInActive: (row: Staff) => void;
   onPageChange: (page: number) => void;
}
