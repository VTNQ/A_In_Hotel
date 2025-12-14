import type { ImageResponse } from "./common";

export interface RoomResponse {
    id:number;
    roomType:string;
    roomName:string;
    capacity:string;
    area:string;
    defaultRate:number;
    images:ImageResponse[];
}

export interface RoomCardProps {
    room:RoomResponse;
}
