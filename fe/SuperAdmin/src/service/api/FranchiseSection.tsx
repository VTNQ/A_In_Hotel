import type { GetAllOptions } from "@/type/GetAllOptions";
import Http from "../http/http";

export const getFranchiseSection = async (options: GetAllOptions = {}) => {
  const {
    page = 1,
    size = 5,
    sort = "id,desc",
    filter,
    searchField,
    searchValue,
    all = false,
  } = options;
  const resp = await Http.get("/api/franchise-section",{
    params: { page, size, sort, filter, searchField, searchValue, all },
  });
  return resp.data;
};
export const createFranchiseSection = async (data: any) => {
  return await Http.post("/api/franchise-section", data);
}
export const updateFranchiseSection = async (id: number, data: any) => {
  return await Http.put(`/api/franchise-section/${id}`, data);
}
export const getFranchiseSectionById = async (id: number) => {
  return await Http.get(`/api/franchise-section/${id}`);
}
export const updateStatus = async (id: number, status: boolean) => {
  return await Http.patch(`/api/franchise-section/updateStatus/${id}?status=${status}`)
}