import {  z } from "zod";

export const createImageExtraServiceSchema = (t: (key: string) => string) => {
  return z
    .any()
    .refine((file) => file instanceof File, {
      message: t("extraService.validate.imageRequired"),
    })
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: t("extraService.validate.imageTooLarge"),
    })
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      {
        message: t("extraService.validate.imageInvalidType"),
      },
    );
};
export const createImageFranchiseSectionItemPage = (t:(key:string)=>string)=>{
   return z
    .any()
    .refine((file) => file instanceof File, {
      message: t("franchiseSectionItem.validate.imageRequired"),
    })
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: t("franchiseSectionItem.validate.imageTooLarge"),
    })
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      {
        message: t("franchiseSectionItem.validate.imageInvalidType"),
      },
    );
}

export const createImageAssetSchema = (t: (key: string) => string) => {
  return z
    .any()
    .refine((file) => file instanceof File, {
      message: t("asset.validate.imageRequired"),
    })
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: t("asset.validate.imageTooLarge"),
    })
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      {
        message: t("asset.validate.imageInvalidType"),
      },
    );
};

export const createImageBlogSchema = (t: (key: string) => string) => {
  return z
    .any()
    .refine((file) => file instanceof File, {
      message: t("blog.validate.imageRequired"),
    })
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: t("blog.validate.imageTooLarge"),
    })
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      {
        message: t("blog.validate.imageInvalidType"),
      },
    );
};
export const createImageBannerSchema = (t: (key: string) => string) => {
  return z
    .any()
    .refine((file) => file instanceof File, {
      message: t("banner.validate.imageRequired"),
    })
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: t("banner.validate.imageTooLarge"),
    })
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      {
        message: t("banner.validate.imageInvalidType"),
      },
    );
};

export const createImageHotelSchema = (t: (key: string) => string) => {
  return z
    .any()
    .refine((file) => file instanceof File, {
      message: t("hotel.validate.imageRequired"),
    })
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: t("hotel.validate.imageTooLarge"),
    })
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      {
        message: t("hotel.validate.imageInvalidType"),
      },
    );
};

export const createImageAdminSchema = (t: (key: string) => string) => {
  return z
    .any()
    .refine((file) => file instanceof File, {
      message: t("admin.validate.imageRequired"),
    })
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: t("admin.validate.imageTooLarge"),
    })
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      {
        message: t("admin.validate.imageInvalidType"),
      },
    );
};
