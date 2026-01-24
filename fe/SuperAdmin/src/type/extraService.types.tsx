import type { ImageResponse } from "./common";
import type { StatusFilter } from "./hotel.types";


export interface ExtraService {
  id: number;
  serviceCode: string;
  serviceName: string;
  description: string;
  note: string;
  categoryName: string;
  categoryId: number;
  hotelName: string;
  price: number;
  type: number;
  icon: ImageResponse;
  unit: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface ExtraServiceFilterProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (v: StatusFilter) => void;
  categoryFilter: string;
  onCategoryFilterChange: (v: string) => void;
  hotelFilter: string;
  onHotelFilterChange: (v: string) => void;
}
export interface ExtraServiceEditProps{
  open:boolean;
  extraServiceId:number | null;
  onClose: ()=>void;
  onSubmit:()=>void;
}
export interface ExtraServiceForm {
  name:string;
  description:string;
  categoryId:string | null;
  unit:string | null;
  price:string;
  type:string;
  hotelId:string | null;
  extraCharge:string;
  icon:File | null;
  note:string;
}

export interface ExtraServiceActionMenuProps {
  extraService: ExtraService;
  onEdit?: (extraService: ExtraService) => void;
  onActivate?: (extraService: ExtraService) => void;
  onDeactivate?: (extraService: ExtraService) => void;
}

export interface ExtraServiceTableProps {
  rows: ExtraService[];
  loading: boolean;
  sortKey: keyof ExtraService | null;
  sortDir: "asc" | "desc";
  onSortChange: (key: keyof ExtraService) => void;
  onEdit: (row: ExtraService) => void;
  onActivate: (row: ExtraService) => void;
  onDeactivate: (row: ExtraService) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}