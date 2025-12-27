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