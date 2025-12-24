import type { ImageResponse } from "./common";

export interface RoomResponse {
    id:number;
    roomType:string;
    roomName:string;
    hotelName:string;
    capacity:string;
    area:string;
    hotelId:number;
    note:string;
    defaultRate:number;
    images:ImageResponse[];
}

export interface RoomCardProps {
    room:RoomResponse;
     onClick: () => void;
}
