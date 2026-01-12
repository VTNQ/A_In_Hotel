export interface ExtraServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export type UnitExtraService =
  | "PERNIGHT"
  | "PERDAY"
  | "PERUSE"
  | "PERTRIP";



export interface UpdateExtraServiceFormModalProps
  extends ExtraServiceFormModalProps {
  serviceId: any; // dữ liệu service cần sửa
}
export interface ExtraService {
  id?: number;
  name?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
  unit?: UnitExtraService;
  [key: string]: any;
}

export interface ExtraServiceActionMenuProps {
  service: ExtraService;
  onEdit?: (service: ExtraService) => void;
  onActivate?: (service: ExtraService) => void;
  onDeactivate?: (service: ExtraService) => void;
}
