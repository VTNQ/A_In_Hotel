import type { ImageResponse } from "./common";
import type { PromotionResponse } from "./promotion.type";

export interface RoomResponse {
  id: number;
  roomTypeName: string;
  roomName: string;
  hotelName: string;
  hotelAddress: string;
  capacity: string;
  area: string;
  hourlyBasePrice: number;
  overnightPrice: number;
  hourlyAdditionalPrice: number;
  idRoomType: number;
  hotelId: number;
  note: string;
  defaultRate: number;
  images: ImageResponse[];
}
export interface RoomGridProps {
  page: number;
  priceRange: string[];
  assets:string[];
  promotions?: Map<number,PromotionResponse>;
  roomTypes:string[];
  onPageInfo: (totalPages: number) => void;
  onSelect: (room: RoomResponse) => void;
  onLoaded: (rooms: RoomResponse[],reset:boolean) => void;
  selectedRoomId?: number;
  roomGrid: RoomResponse[];
  onLoading:(loading:boolean)=>void;
}
export interface RoomCardProps {
  room: RoomResponse;
  onClick: () => void;
  isSelected?: boolean;
 promotion?: PromotionResponse;
}
