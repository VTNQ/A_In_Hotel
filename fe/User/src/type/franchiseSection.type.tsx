import type { ImageResponse } from "./common";

export interface franchiseSectionResponse {
    id:number;
    code:string;
    title:string;
    subTitle:string;
    description:string;
    sortOrder:number;
    active:boolean;
    items:franchiseSectionItemResponse[];
}
export interface franchiseSectionItemResponse {
    id:number;
    title:string;
    description:string;
    sortOrder:number;
    active:boolean;
    icon:ImageResponse;
}