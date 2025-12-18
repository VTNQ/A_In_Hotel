import type { BannerResponse } from "../../type/banner.type";
import {  type ApiResponse, type GetAllOptions, type PageResponse } from "../../type/common";
import Http from "../http/http";

export const getBanner = async(options:GetAllOptions={})=>{
    const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
    } = options;
    const resp = await Http.get<ApiResponse<PageResponse<BannerResponse>>>("/api/banners/getAll",{
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
    return resp.data;
}