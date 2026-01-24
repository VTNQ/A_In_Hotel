import type { GetAllOptions } from "@/type/GetAllOptions";
import Http from "../http/http";

export const getAllCategories = async(options:GetAllOptions={})=>{
    const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
      } = options;
      const resp = await Http.get("/api/categories",{
        params: { page, size, sort, filter, searchField,searchValue, all },
        skipAuth:true
      });
      return resp.data;
}
export const createCategory = async(data:any)=>{
  return await Http.post("/api/categories",data);
}
export const getCategoryById = async(id:number)=>{
  return await Http.get(`/api/categories/${id}`);
}
export const updateCategoryById = async(id:number,data:any)=>{
  return await Http.put(`/api/categories/${id}`,data);
}
export const updateStatus = async (id: number, status: boolean) => {
  return await Http.patch(`/api/categories/updateStatus/${id}?status=${status}`)
}