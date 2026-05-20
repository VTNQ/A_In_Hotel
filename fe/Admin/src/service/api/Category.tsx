import type { ApiResponse, GetAllOptions } from "../../type";
import type { Category, CategoryFormData } from "../../type/category.types";
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
  const res = await Http.get<ApiResponse<Category>>("/api/categories", {
    params: { page, size, sort, filter, searchField, searchValue, all },
  })
  return res.data;
}
export const addCategory = async (categoryData: CategoryFormData) => {
  return await Http.post<ApiResponse<void>>('/api/categories', categoryData);
}
export const updateCategory = async (id: number, categoryData: CategoryFormData) => {
  return await Http.put<ApiResponse<void>>(`/api/categories/${id}`, categoryData);
}
export const updateStatus = async (id: number, status: boolean) => {
  return await Http.patch(`/api/categories/updateStatus/${id}?status=${status}`)
}
export const findById =async(id:number)=>{
  return await Http.get<ApiResponse<Category>>(`/api/categories/${id}`)
}