import type { ImageResponse } from "./common";

export interface BlogResponse {
    id:number;
    blogCode:string;
    title:string;
    category:string;
    categoryId:number;
    content:string;
    description:string;
    status:number;
    createdAt:string;
    updatedAt:string;
    image:ImageResponse
}