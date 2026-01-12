export interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export interface UpdateCategoryFormModalProps extends CategoryFormModalProps {
  categoryId: any; 
}
export interface Category {
  id?: number;
  name?: string;
  description?: string;
  isActive?: boolean;
  [key: string]: any;
}
export interface CategoryActionMenuProps {
  category: Category;
  onView?: (category: Category) => void;
  onEdit?: (category: Category) => void;
  onActivate?: (category: Category) => void;
  onDeactivate?: (category: Category) => void;
}
export interface ViewCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: any;
}