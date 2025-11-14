import type { GetAllOptions } from "../../type";
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
    const resp= await Http.get("/api/assets",{
        params: { page, size, sort, filter, searchField, searchValue, all },
    });
    return resp.data;
}
export const createAsset=async(assetData:any)=>{
    return await Http.post("/api/assets",assetData)
}
export const updateAsset=async(id:number,assetData:any)=>{
    return await Http.put(`/api/assets/${id}`,assetData)
}
export const updateStatus=async(id:number,status:number)=>{
    return await Http.patch(`/api/assets/updateStatus/${id}?status=${status}`)

}
export const findById=async(id:number)=>{
    return await Http.get(`/api/assets/${id}`)
}