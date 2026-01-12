export interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export interface UpdateBlogFormModalProps extends BlogFormModalProps {
  blogId: any;
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