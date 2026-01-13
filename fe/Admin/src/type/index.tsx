import type { LucideIcon } from "lucide-react";
export type GetAllOptions = {
  page?: number;
  size?: number;
  sort?: string;
  filter?: string;
  searchField?: string;
  searchValue?: string;
  all?: boolean;
};

export interface MenuItem {
  label: string;
  icon?: LucideIcon;
  path?: string;
  children?: MenuItem[];
}
export interface CommonModalProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
}


export interface CustomDatePickerProps {
  value: Date | null;
  onChange: (value: Date | null) => void;
  placeholder?: string;
    minDate?: Date;
}
export interface BookingActionMenuProps {
  booking: {
    status?: number;
    [key: string]: any; // Cho phép các field khác (roomCode, name, ...)
  };
  onView?: (booking: any) => void;
  onEdit?: (booking: any) => void;
  onCancel?: (booking: any) => void;
  onCheckIn?: (booking: any) => void;
  onCheckOut?: (booking: any) => void;
  onSwitchRoom?: (booking: any) => void;
}

export interface TabItem {
  key: string;
  label: string;
}
export interface CommonModalViewProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  width?: string;
  isBorderBottom?: boolean;
  widthClose?: string;
  withCenter?: string;
}
export interface SelectOption {
  label: string;
  value: string;
   disabled?: boolean;        
  description?: string;   
}

export interface SelectProps {
  label?: string;
  value?: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export interface ImageResponse {
  url: string;
  altText: string;
}
