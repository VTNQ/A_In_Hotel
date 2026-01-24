
import type { StatusFilter } from "./hotel.types";

export interface Category {
  id?: number;
  name?: string;
  code?:string;
  type?:string;
  capacity?:number;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface CategoryFilterProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (v: StatusFilter) => void;
  typeFilter: string;
  onTypeFilterChange: (v: string) => void;
}
export interface CategoryEditProps{
  open:boolean;
  categoryId:number | null;
  onClose: ()=>void;
  onSubmit:()=>void;
}
export interface CategoryForm {
  name:string;
  type:string | null;
  description:string;
}
export interface CategoryActionMenuProps {
  category: Category;
  onView?: (category: Category) => void;
  onEdit?: (category: Category) => void;
  onActivate?: (category: Category) => void;
  onDeactivate?: (category: Category) => void;
}
export interface CategoryTableProps {
  rows: Category[];
  loading: boolean;
  sortKey: keyof Category | null;
  sortDir: "asc" | "desc";
  onSortChange: (key: keyof Category) => void;
  onEdit: (row: Category) => void;
  onActivate: (row: Category) => void;
  onDeactivate: (row: Category) => void;
  onView: (row: Category) => void;
  page:number;
  pageSize:number;
  total:number;
  onPageChange: (page: number) => void;
}
export interface ViewCategoryProps {
  isOpen:boolean;
  onClose:()=>void;
  categoryId:any;
}