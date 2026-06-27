import type { GetAllOptions } from "@/type/GetAllOptions";
import Http from "../http/http";

export const getFranchiseInquiry = async(options:GetAllOptions={})=>{
    const {
    page = 1,
    size = 5,
    sort = "id,desc",
    filter,
    searchField,
    searchValue,
    all = false,
  } = options;
  const resp = await Http.get("/api/franchise-inquiry",{
      params: { page, size, sort, filter, searchField, searchValue, all },
  });
  return resp.data;
}