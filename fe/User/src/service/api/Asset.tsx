import type { GetAllOptions } from "../../type/common";
import Http from "../http/http";

export const GetAsset = async(options:GetAllOptions)=>{
        const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
    } = options;

    const resp = await Http.get("/api/assets",{
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