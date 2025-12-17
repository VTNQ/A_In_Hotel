import type { AssetResponse } from "./asset.type";
import type { ImageResponse } from "./common";

export interface RooTypeResponse {
    id:number;
    name:string;
    description:string;
    roomImage:ImageResponse;
    assets:AssetResponse[];
}