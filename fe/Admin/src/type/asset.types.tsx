export interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface UpdateAssetFormModalProps extends AssetFormModalProps {
  assetId: any; // dữ liệu asset cần sửa
}

export interface AssetActionMenuProps {
  asset: {
    status?: number;
    [key: string]: any;
  };
  onView?: (room: any) => void;
  onEdit?: (room: any) => void;
  onActivate?: (room: any) => void;
  onDeactivate?: (room: any) => void;
  onMaintenance?: (room: any) => void;
}

export interface ViewAssetProps {
  isOpen: boolean;
  onClose: () => void;
  assetId: any;
}