import type { ImageResponse } from "./common";

export interface Room {
  id: number;
  roomNumber: string;
  roomName: string;
  roomCode: string;
  capacity: number;
  idRoomType: number;
  hotelName: string;
  hotelAddress: string;
  roomTypeName: string;
  status: number;
  defaultRate: number;
  floor: number;
  area: number;
  note: string;
  images: ImageResponse[];
  hourlyBasePrice: number;
  hourlyAdditionalPrice: number;
  overnightPrice: number;
  createdAt: string;
  updatedAt: string;
}
export type RoomStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type RoomStatusFilter = "ALL" | RoomStatus;
export interface RoomFilterProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: RoomStatusFilter;
  onStatusFilterChange: (v: RoomStatusFilter) => void;
  roomTypeFilter: string;
  onRoomTypeFilterChange : (v: string) => void;
  onHotelFilterChange: (v: string) => void;
  hotelFilter: string;
}
export interface RoomTableProps {
  rows: Room[];
  loading: boolean;
  sortKey: keyof Room | null;
  sortDir: "asc" | "desc";
  onSortChange: (key: keyof Room) => void;
  page: number;
  pageSize: number;
  total: number;
  onView: (row: Room) => void;
  onEdit: (row: Room) => void;
  onActivate: (row: Room) => void;
  onDeactivate: (row: Room) => void;
  onMaintenance: (row: Room) => void;
  onPageChange: (page: number) => void;
}
export interface RoomForm{
  roomNumber:string;
  roomName:string;
  idRoomType:string | null;
  capacity:string;
  defaultRate:string;
  floor:string;
  hotelId:string | null;
  area:string;
  hourlyBasePrice:string;
  hourlyAdditionalPrice:string;
  overnightPrice:string;
  note:string;
  image:File[] | null;
  oldImages?:string[];
}
export interface RoomEditProps {
  open:boolean;
  roomId:number | null;
  onClose: ()=>void;
  onSubmit:()=>void;

}
export interface RoomActionMenuProps {
  room:Room;
  onView?: (room: any) => void;
  onEdit?: (room: any) => void;
  onActivate?: (room: any) => void;
  onDeactivate?: (room: any) => void;
  onMaintenance?: (room: any) => void;
}

export interface ViewRoomProps {
  isOpen:boolean;
  onClose:()=>void;
  roomId:any;
}