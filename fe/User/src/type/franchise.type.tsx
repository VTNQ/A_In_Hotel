import type { ImageResponse } from "./common";

export interface FranchiseResponse {
    title:string;
    description:string;
    bannerImage:ImageResponse;
    primaryButtonText:string;
    primaryButtonUrl:string;
    secondaryButtonText:string;
    secondaryButtonUrl:string
}