import type { ApiResponse, GetAllOptions, PageResponse } from "../../type/common";
import type { facilitiesResponse } from "../../type/facilities.types";
import Http from "../http/http";

export const getAllFacilities =async(options:GetAllOptions={})=>{
    const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
    } = options;

    const resp = await Http.get<ApiResponse<PageResponse<facilitiesResponse>>>("/api/extra-room-service/all", {
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