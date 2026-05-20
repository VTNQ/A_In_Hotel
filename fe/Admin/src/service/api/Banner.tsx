import type { ApiResponse, GetAllOptions, PageResponse } from "../../type";
import type { Banner, BannerFormModalProp } from "../../type/banner.types";
import Http from "../http/http";

export const getBanner = async(options:GetAllOptions={})=>{
     const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
    } = options;
    const resp = await Http.get<ApiResponse<PageResponse<Banner>>>("/api/banners/getAll",{
        params: { page, size, sort, filter, searchField, searchValue, all },
    });
    return resp.data;
}

export const updateBanner = async (id: number, bannerData: BannerFormModalProp) => {
     const formData = new FormData();
    Object.entries(bannerData).forEach(([key, value]) => {
        if (key !== "image" && value !== undefined && value !== null) {
            formData.append(key, value.toString());
        }
    });
    if (bannerData.image) {
        formData.append("image", bannerData.image);
    }
    return await Http.put(`/api/banners/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export const createBanner = async (bannerData: BannerFormModalProp) => {
     const formData = new FormData();
    Object.entries(bannerData).forEach(([key, value]) => {
        if (key !== "image" && value !== undefined && value !== null) {
            formData.append(key, value.toString());
        }
    });
    if (bannerData.image) {
        formData.append("image", bannerData.image);
    }

    return await Http.post<ApiResponse<void>>("/api/banners/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}
export const findById = async (id:number)=>{
    return await Http.get<ApiResponse<Banner>>(`/api/banners/${id}`)

}