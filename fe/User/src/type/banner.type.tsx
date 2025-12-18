import type { ImageResponse } from "./common";

export interface BannerResponse{
    id:number;
    name:string;
    startAt:string;
    endAt:string;
    ctaLabel:string;
    image:ImageResponse;
    description:string;
}