import type { ImageResponse } from "./common";
import i18n from "../i18n/i18n";
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
  { id: 0, key: "blogCategories.allPosts" },
  { id: 1, key: "blogCategories.newsUpdates" },
  { id: 2, key: "blogCategories.offersPromotions" },
  { id: 3, key: "blogCategories.travelGuides" },
  { id: 4, key: "blogCategories.localFood" },
  { id: 5, key: "blogCategories.bookingTips" },
  { id: 6, key: "blogCategories.hotelServices" },
  { id: 7, key: "blogCategories.eventsActivities" },
  { id: 8, key: "blogCategories.nearbyAttractions" },
  { id: 9, key: "blogCategories.travelTips" },
  { id: 10, key: "blogCategories.guestExperiences" },
];