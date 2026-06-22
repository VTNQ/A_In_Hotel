import type { ImageResponse } from "./common";

export interface FranchiseSectionItem {
  id: number;
  title: string;
  description: string;
  icon: ImageResponse;
  sortOrder: number;
  active: boolean;
}
export interface FranchiseSectionItemTableProps {
  rows: FranchiseSectionItem[];
  loading: boolean;
  sortKey: keyof FranchiseSectionItem | null;
  sortDir: "asc" | "desc";
  onSortChange: (key: keyof FranchiseSectionItem) => void;
  page: number;
  pageSize: number;
  total: number;
  onEdit?: (franchiseSectionItem: FranchiseSectionItem) => void;
  onActive?:(franchiseSectionItem:FranchiseSectionItem)=>void;
  onDeActive?:(franchiseSectionItem:FranchiseSectionItem)=>void;
  onPageChange: (page: number) => void;
}
export interface FranchiseSectionItemMenuProps {
  franchiseSectionItem: FranchiseSectionItem;
  onEdit?: (franchiseSectionItem: FranchiseSectionItem) => void;
  onActive?:(franchiseSectionItem:FranchiseSectionItem)=>void;
  onDeActive?:(franchiseSectionItem:FranchiseSectionItem)=>void;
}
export interface FranchiseSectionItemFilterProps {
  search: string;
  onSearchChange: (v: string) => void;
  SectionId:any;
}
export interface FranchiseSectionItemEditProps {
  open: boolean;
  franchiseSectionItemId: number | null;
  onClose: () => void;
  onSubmit: () => void;
}
