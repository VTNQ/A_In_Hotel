import type { ImageResponse } from "./common";

export interface RoomResponse {
    id: number;
    roomTypeName: string;
    roomName: string;
    hotelName: string;
    hotelAddress:string;
    capacity: string;
    area: string;
    hotelId: number;
    note: string;
    defaultRate: number;
    images: ImageResponse[];
}

export interface RoomCardProps {
    room: RoomResponse;
    onClick: () => void;
    isSelected?: boolean;
}
