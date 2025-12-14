import type { ImageResponse } from "./common";

export interface SystemContent {
    title: string;
    description: string;

    ctaText: string;
    backgroundImage: ImageResponse;
}