import type { HotelResponse } from "./hotel.types";

export interface GetAllOptions {
  page?: number;
  size?: number;
  sort?: string;
  filter?: string;
  searchField?: string;
  searchValue?: string;
  all?: boolean;
}
export interface Tokens {
  accessToken: string;
  refreshToken?: string;
  accessTokenAt: number;
  refreshTokenAt?: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: number;
}
export interface ApiResponseList<T> {
  data?: T[];
  message?: string;
  status?: number;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
export interface ImageResponse {
  url: string;
  altText: string;
}
export interface CalendarUIProps {
  selectedDates?: string[];
  disabledDates?: string[];
  onSelect: (date: string) => void;
}

export interface SelectHotelButtonProps {
  hotels: HotelResponse[];
  value?: HotelResponse | null;
  onChange: (hotel: HotelResponse) => void;
  placeholder?: string;
}

export interface PaginationProp {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}
export interface SelectOption {
  label: string;
  value: string;
}
export interface CustomerTypeSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
}
export interface RoomFilterSideBarProps {
  priceRanges:string[];
  onPriceChange:(v:string[])=>void;
}