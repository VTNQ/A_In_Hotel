import type { ApiResponse, GetAllOptions, PageResponse } from "../../type/common";
import type { franchiseSectionResponse } from "../../type/franchiseSection.type";
import Http from "../http/http";

export const getFranchiseSections = async(options:GetAllOptions)=>{
     const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
    } = options;

    const resp = await Http.get<ApiResponse<PageResponse<franchiseSectionResponse>>>("/api/franchise-section",{
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