import type { ImageResponse } from ".";

export interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export interface UpdateBlogFormModalProps extends BlogFormModalProps {
  blogId: any;
}
export interface BlogForm{
  title:string;
  category:number;
  description:string;
  content:string;
  status:number;
  image:File;
}
export interface BlogResponse{
  id:number;
  blogCode:string;
  title:string;
  category:string;
  categoryId:number;
  content:string;
  description:string;
  status:number;
  createdAt:string;
  updatedAt:string;
  image:ImageResponse;
}
export interface BlogActionMenuProps {
  blog: {
    status?: number;
    [key: string]: any;
  };
  onView?: (blog: any) => void;
  onEdit?: (blog: any) => void;
  onPublish?: (blog: any) => void;
  onArchive?: (blog: any) => void;
  onRestore?: (blog: any) => void;
}

export interface ViewBlogProps {
  isOpen: boolean;
  onClose: () => void;
  blogId: any;
}