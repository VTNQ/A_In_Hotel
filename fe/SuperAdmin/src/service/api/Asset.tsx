import type { GetAllOptions } from "@/type/GetAllOptions";
import Http from "../http/http";

export const getAllAsset = async(options: GetAllOptions = {})=>{
      const {
    page = 1,
    size = 5,
    sort = "id,desc",
    filter,
    searchField,
    searchValue,
    all = false,
  } = options;
  const resp = await Http.get("/api/assets",{
    params: { page, size, sort, filter, searchField, searchValue, all },
    skipAuth:true  
  });
  return resp.data;
}
export const getAssetById = async(id:number)=>{
  const response = await Http.get(`/api/assets/${id}`,{skipAuth:true});
  return response?.data?.data;
}
export const updateAsset = async(asset:any,id:number)=>{
   const formData = new FormData();
   Object.entries(asset).forEach(([key, value]) => {
      if (key !== "image" && value !== undefined && value !== null) {
          formData.append(key, value.toString());
      }
  });
   if (asset.image) {
      formData.append("image", asset.image);
  }
   return await Http.put(`/api/assets/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
  });
}
export const createAsset = async(asset:any)=>{
  const formData = new FormData();
   Object.entries(asset).forEach(([key, value]) => {
      if (key !== "image" && value !== undefined && value !== null) {
          formData.append(key, value.toString());
      }
  });
   if (asset.image) {
      formData.append("image", asset.image);
  }
  return await Http.post(`/api/assets`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
  });
}

export const updateStatusAsset = async (id: number, status: boolean) => {
  return await Http.patch(`/api/assets/updateStatus/${id}?status=${status}`)
}