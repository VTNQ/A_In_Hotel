import type { ImageResponse } from "./common";

export interface BlogResponse {
  id: number;
  blogCode: string;
  title: string;
  category: string;
  categoryId: number;
  content: string;
  description: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  image: ImageResponse;
}
export const BLOG_CATEGORIES = [
  { id: 0, label: "All Posts" },
  { id: 1, label: "News & Updates" },
  { id: 2, label: "Offers & Promotions" },
  { id: 3, label: "Travel Guides" },
  { id: 4, label: "Local Food" },
  { id: 5, label: "Booking Tips" },
  { id: 6, label: "Hotel Services" },
  { id: 7, label: "Events & Activities" },
  { id: 8, label: "Nearby Attractions" },
  { id: 9, label: "Travel Tips" },
  { id: 10, label: "Guest Experiences" },
];
