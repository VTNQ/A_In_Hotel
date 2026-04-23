import {  z } from "zod";

export const createImageExtraServiceSchema = (t: (key: string) => string) => {
  return z
    .any()
    .refine((file) => file instanceof File, {
      message: t("extraService.validate.imageRequired"),
    })
    .refine((file) => !file || file.size <= 5 * 1024 * 1024,{
        message: t("extraService.validate.imageTooLarge"),
    })
    .refine(
        (file)=>
            !file ||
        ["image/jpeg", "image/png", "image/gif"].includes(file.type),
        {
            message: t("extraService.validate.imageInvalidType"),
        }
    );
};

export const createImageAssetSchema = (t:(key:string)=>string)=>{
    return z
        .any()
        .refine((file)=>file instanceof File,{
             message: t("asset.validate.imageRequired"),
        })
        .refine((file)=>!file || file.size <= 5 * 1024 * 1024,{
            message: t("asset.validate.imageTooLarge"),
        })
         .refine(
        (file)=>
            !file ||
        ["image/jpeg", "image/png", "image/gif"].includes(file.type),
        {
            message: t("asset.validate.imageInvalidType"),
        }
    );
}

export const createImageBlogSchema = (t:(key:string)=>string)=>{
    return z
    .any()
    .refine((file)=>file instanceof File,{
        message: t("blog.valid.imageRequired")
    })
    .refine((file)=>!file || file.size <= 5 * 1024 * 1024,{
        message: t("blog.valid.imageTooLarge"),
    })
    .refine(
        (file)=>
            !file ||
        ["image/jpeg", "image/png", "image/gif"].includes(file.type),
        {
            message: t("blog.valid.imageInvalidType"),
        }
    );
}