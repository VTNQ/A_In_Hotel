import type {  BookingResponse } from "./booking.types";

export interface Customer {
    id:number;
    customerCode:string;
    email:string;
    fullName:string;
    phone:string;
    blocked:boolean;
    totalCompletedBookings:number;
    rewardBalance:number;
    lastBookingAt:string;
}
export interface CustomerFilterProps {
  search: string;
  onSearchChange: (v: string) => void;
  
}
export interface CustomerTableProps {
  rows: Customer[];
  loading: boolean;
  sortKey: keyof Customer | null;
  onBlocked:(row:Customer)=>void;
  sortDir: "asc" | "desc";
  onSortChange: (key: keyof Customer) => void;
  onView: (row: Customer) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export interface bookingHistoryTableProps{
  rows:BookingResponse[];
  loading:boolean;
  sortKey:keyof BookingResponse | null;
  sortDir:"asc" | "desc";
  onSortChange:(key:keyof BookingResponse)=>void;
  page:number;
  pageSize:number;
  total:number;
  onPageChange:(page:number)=>void;
}
export interface CustomerActionMenuProps {
  customer: Customer;
  onView?: (customer: any) => void;
  
}