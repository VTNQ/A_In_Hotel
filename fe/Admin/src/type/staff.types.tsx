import type { ExtraService } from "./extraService.types";

export interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export interface Staff {
  id?: number;
  fullName?: string;
  isActive?: boolean;
  [key: string]: any;
}

export interface StaffActionMenuProps {
  staff: Staff;
  onActivate?: (service: ExtraService) => void;
  onDeactivate?: (service: ExtraService) => void;
}