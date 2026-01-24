import type { ImageResponse } from "./common";

export interface Asset {
  id: number;
  assetCode: string;
  assetName: string;
  categoryId: string;
  categoryName: string;
  hotelId: string;
  roomId: string;
  roomNumber: string;
  price: string;
  quantity: string;
  status: number;
  note: string;
  hotelName: string;
  createdAt: string;
  updatedAt: string;
  thumbnail: ImageResponse;
}
export type AssetStatus = 1 | 2 | 3 | 4;
export type AssetStatusFilter = "ALL" | AssetStatus;
export interface AssetFilterProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: AssetStatusFilter;
  onStatusFilterChange: (v: AssetStatusFilter) => void;
  categoryFilter: string;
  onCategoryFilterChange: (v: string) => void;
  hotelFilter: string;
  onHotelFilterChange: (v: string) => void;
}
export interface AssetEditProps {
  open: boolean;
  assetId: number | null;
  onClose: () => void;
  onSubmit: () => void;
}
export interface AssetForm {
  assetName: string;
  categoryId: string | null;
  hotelId: string | null;
  roomId: string | null;
  price: string;
  quantity: string;
  note: string;
  image: File | null;
}
export interface AssetActionMenuProps {
  asset: Asset;
  onView?: (asset: any) => void;
  onEdit?: (asset: any) => void;
  onActivate?: (asset: any) => void;
  onDeactivate?: (asset: any) => void;
  onMaintenance?: (asset: any) => void;
}

export interface AssetTableProps {
  rows: Asset[];
  loading: boolean;
  sortKey: keyof Asset | null;
  sortDir: "asc" | "desc";
  onSortChange: (key: keyof Asset) => void;
  onEdit: (row: Asset) => void;
  onView: (row: Asset) => void;
  onActivate: (row: Asset) => void;
  onDeactivate: (row: Asset) => void;
  onMaintenance: (row: Asset) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export interface ViewAssetProps {
  isOpen: boolean;
  onClose: () => void;
  assetId: any;
}