import type { RoomSection } from "../Room/RoomDetailsModal";

export interface RoomDetailsData {
  name: string; // e.g., "Guest room"
  headline: string; // e.g., "1 King"
  description: string;
  images: string[];
  ctaLabel?: string; // e.g., "View Rates"
  sections?: RoomSection[]; // 2-column grid of sections
}
