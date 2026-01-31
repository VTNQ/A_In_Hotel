import type { ImageResponse } from "./common";

export type BannerForm = {
  title: string;
  startDate?: Date;
  endDate?: Date;
  cta: string;
  desc: string;
  bannerImage: File | null;
};
export interface BannerFilterProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
}
export interface Banner {
  id: number;
  name: string;
  startAt: string;
  endAt: string;
  bannerCode: string;
  ctaLabel: string;
  image: ImageResponse;
  description: string;
  createdAt: string;
  updatedAt: string;
}
export interface BannerEditProps{
  open:boolean;
  bannerId:number | null;
  onClose: ()=>void;
  onSubmit:()=>void;
}
export interface BannerTableProps {
  rows: Banner[];
  loading: boolean;
  sortKey: keyof Banner | null;
  sortDir: "asc" | "desc";
  onSortChange: (key: keyof Banner) => void;
  onEdit: (row: Banner) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}
export interface BannerActionMenuProps {
  banner: Banner;
  onEdit?: (banner: Banner) => void;
}