export interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface Banner {
  id?: number;
  name?: string;
  [key: string]: any;
}

export interface BannerActionMenuProps {
  banner: Banner;
  onEdit?: (banner: Banner) => void;
}
export interface BannerEditFormModalProps extends BannerFormModalProps {
  bannerId: any;
}
