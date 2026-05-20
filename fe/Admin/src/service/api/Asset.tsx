import type { ApiResponse, GetAllOptions, PageResponse } from "../../type";
import type { Asset, AssetForm } from "../../type/asset.types";
import Http from "../http/http";

export const getAllAsset=async(options:GetAllOptions={})=>{
    const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
    } = options;
    const resp= await Http.get<ApiResponse<PageResponse<Asset>>>("/api/assets",{
        params: { page, size, sort, filter, searchField, searchValue, all },
    });
    return resp.data;
}
export const createAsset=async(assetData:AssetForm)=>{
    const formData = new FormData();
    Object.entries(assetData).forEach(([key, value]) => {
        if (key !== "image" && value !== undefined && value !== null) {
            formData.append(key, value.toString());
        }
    });
    if (assetData.image) {
        formData.append("image", assetData.image);
    }
    return await Http.post<ApiResponse<void>>("/api/assets", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

}
export const updateAsset=async(id:number,assetData:any)=>{
    const formData = new FormData();
    Object.entries(assetData).forEach(([key, value]) => {
        if (key !== "image" && value !== undefined && value !== null) {
            formData.append(key, value.toString());
        }
    });
    if (assetData.image) {
        formData.append("image", assetData.image);
    }
    return await Http.put<ApiResponse<void>>(`/api/assets/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}
export const updateStatus=async(id:number,status:number)=>{
    return await Http.patch<ApiResponse<void>>(`/api/assets/updateStatus/${id}?status=${status}`)

}
export const findById=async(id:number)=>{
    return await Http.get<ApiResponse<Asset>>(`/api/assets/${id}`)
}