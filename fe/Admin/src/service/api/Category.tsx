import type { GetAllOptions } from "../../type";
import Http from "../http/http";

export const getAllCategory = async (options: GetAllOptions = {}) => {
  const {
    page = 1,
    size = 5,
    sort = "id,desc",
    filter,
    searchField,
    searchValue,
    all = false,
  } = options;
  const res = await Http.get("/api/categories", {
    params: { page, size, sort, filter, searchField, searchValue, all },
  })
  return res.data;
}
export const addCategory = async (categoryData: any) => {
  return await Http.post('/api/categories', categoryData);
}
export const updateCategory = async (id: number, categoryData: any) => {
  return await Http.put(`/api/categories/${id}`, categoryData);
}
export const updateStatus = async (id: number, status: boolean) => {
  return await Http.patch(`/api/categories/updateStatus/${id}?status=${status}`)
}
export const findById =async(id:number)=>{
  return await Http.get(`/api/categories/${id}`)
}