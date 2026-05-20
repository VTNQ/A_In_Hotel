import type { ImageResponse } from ".";

export interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export interface AssetForm {
  assetName:string;
  categoryId:string;
  roomId:string;
  price:string;
  quantity:string;
  note:string;
  image:File;
}
export interface Asset {
  id: number;
  assetCode: string;
  assetName: string;
  categoryId: number;
  categoryName: string;
  hotelId:number;
  roomId:number;
  roomNumber:string;
  price:number;
  quantity:number;
  note:string;
  hotelName:string;
  thumbnail:ImageResponse;
  createdAt:string;
  updatedAt:string;
}
export interface UpdateAssetFormModalProps extends AssetFormModalProps {
  assetId: number; // dữ liệu asset cần sửa
}

export interface AssetActionMenuProps {
  asset: Asset;
  onView?: (asset: Asset) => void;
  onEdit?: (room: Asset) => void;
  onActivate?: (room: Asset) => void;
  onDeactivate?: (room: Asset) => void;
  onMaintenance?: (room: Asset) => void;
}

export interface ViewAssetProps {
  isOpen: boolean;
  onClose: () => void;
  assetId: number;
}
