import type { ImageResponse } from ".";

export interface RoomAsset {
 id:number;
  thumbnail: ImageResponse;
  quantity: number | string;
  assetName: string;
}
export interface Room {
  id:number;
  roomNumber: string;
  roomTypeName:string;
  price:number;
}
export interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export interface RoomActionMenuProps {
  room: {
    status?: number;
    [key: string]: any; // Cho phép các field khác (roomCode, name, ...)
  };
  onView?: (room: any) => void;
  onEdit?: (room: any) => void;
  onActivate?: (room: any) => void;
  onDeactivate?: (room: any) => void;
  onMaintenance?: (room: any) => void;
}

export interface ViewRoomManagementProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: any;
}

export interface UpdateRoomFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    roomId: number | null;
}