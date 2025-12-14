import type { BlogResponse } from "../../type/blog.types";
import type { ApiResponse, GetAllOptions, PageResponse } from "../../type/common";
import Http from "../http/http";

export const getBlog =async (options:GetAllOptions={})=>{
    const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
    } = options;
    const resp = await Http.get<ApiResponse<PageResponse<BlogResponse>>>("/api/blogs",{
        params: {
            page,
            size,
            sort,
            filter,
            searchField,
            searchValue,
            all,
          },
          skipAuth: true,
          withCredentials: true,
    });
    return resp.data.data;
}