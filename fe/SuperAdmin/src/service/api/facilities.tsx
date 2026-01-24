import type { GetAllOptions } from "@/type/GetAllOptions";
import Http from "../http/http";

export const getAllFicilities = async(options:GetAllOptions={})=>{
    const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
      } = options;
      const res = await Http.get("/api/extra-room-service/all", {
        params: { page, size, sort, filter, searchField,searchValue, all },
      });
      return res.data;
}
export const getExtraService = async (options: GetAllOptions = {}) => {
  const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
      } = options;
      const res = await Http.get("/api/extra-room-service/all/v2", {
        params: { page, size, sort, filter, searchField,searchValue, all },
      });
      return res.data;
}
export const addExtraService=async(extraData:any) => {
  const formData = new FormData();
  Object.entries(extraData).forEach(([key, value]) => {
      if (key !== "image" && value !== undefined && value !== null) {
          formData.append(key, value.toString());
      }
  });
  if (extraData.image) {
      formData.append("image", extraData.image);
  }
  return await Http.post(`/api/extra-room-service/create`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
  });
  
}

export const getFacilityById=async(id:number)=>{
  const response= await Http.get(`/api/extra-room-service/findById/${id}`,{
    skipAuth:true
  });
  return response.data.data;
}
export const updateStatusFacilities=async(id:number,status:string)=>{
  return await Http.patch(`/api/extra-room-service/updateStatus/${id}?status=${status}`)
}
export const updateExtraServcie = async(id:number,extraData:any)=>{
  const formData = new FormData();
  Object.entries(extraData).forEach(([key, value]) => {
      if (key !== "image" && value !== undefined && value !== null) {
          formData.append(key, value.toString());
      }
  });
  if (extraData.image) {
      formData.append("image", extraData.image);
  }
  return await Http.put(`/api/extra-room-service/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
  });
}