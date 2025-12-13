export interface RoomResponse {
    id:number;
    roomType:string;
    roomName:string;
    defaultRate:number;
    images:ImageResponse[];
}

export interface RoomCardProps {
    room:RoomResponse;
}

export interface ImageResponse {
    url:string;
    altText:string;

}