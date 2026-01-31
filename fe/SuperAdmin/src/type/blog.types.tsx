import type { ImageResponse } from "./common";

export interface Blog {
  id: number;
  blogCode: string;
  title: string;
  category: string;
  categoryId: number;
  content: string;
  description: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  image: ImageResponse;
}
export type BlogStatus = 1 | 2 | 3;
export type BlogStatusFilter = "ALL" | BlogStatus;
export interface BlogFilterProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: BlogStatusFilter;
  onStatusFilterChange: (v: BlogStatusFilter) => void;
}
export interface ViewBlogProps {
  isOpen:boolean;
  onClose:()=>void;
  blogId:number | null;
}
export interface BlogEditProps {
  open:boolean;
  blogId:number | null;
  onClose: ()=>void;
  onSubmit:()=>void;
}
export interface BlogTableProps {
  rows: Blog[];
  loading: boolean;
  sortKey: keyof Blog | null;
  sortDir: "asc" | "desc";
  onSortChange: (key: keyof Blog) => void;
  onEdit: (row: Blog) => void;
  onView:(row:Blog)=>void;
  onPublish?:(row:Blog)=>void;
  onArchive?:(row:Blog)=>void;
  onRestore?:(row:Blog)=>void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}
export interface BlogForm {
  title:string;
  category:string | null;
  description:string;
  content:string;
  status:string | null;
  image:File | null;

}

export interface BlogActionMenuProps {
  blog:Blog;
  onView?: (blog: any) => void;
  onEdit?: (blog: any) => void;
  onPublish?: (blog: any) => void;
  onArchive?: (blog: any) => void;
  onRestore?: (blog: any) => void;
}