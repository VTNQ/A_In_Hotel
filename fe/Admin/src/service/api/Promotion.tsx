import type { GetAllOptions } from "../../type";
import Http from "../http/http";

export const getPromotionAll = async(options:GetAllOptions={})=>{
       const {
    page = 1,
    size = 5,
    sort = "id,desc",
    filter,
    searchField,
    searchValue,
    all = false,
  } = options;
   const res = await Http.get("/api/promotions",{
     params: { page, size, sort, filter, searchField, searchValue, all },
  })
  return res.data;
}