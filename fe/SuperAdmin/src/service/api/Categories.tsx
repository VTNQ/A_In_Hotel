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
