import type { ImageResponse } from ".";

export interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export interface BannerFormModal {
  name: string;
  startAt: string;
  endAt: string;
  ctaLabel: string;
  description: string;
  image: File;
}
export interface Banner {
  id: number;
  name: string;
  startAt: string;
  endAt: string;
  bannerCode: string;
  ctaLabel: string;
  image: ImageResponse;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface BannerActionMenuProps {
  banner: Banner;
  onEdit?: (banner: Banner) => void;
}
export interface BannerEditFormModalProps extends BannerFormModalProps {
  bannerId: any;
}
