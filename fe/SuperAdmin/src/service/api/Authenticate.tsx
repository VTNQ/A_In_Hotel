import type { GetAllOptions } from "@/type/GetAllOptions";
import Http from "../http/http"
import { getTokens } from "@/util/auth";

export const login=async(username:string, password:string) => {
   const response = await Http.post(
    '/api/account/login',
    { username, password },
    { skipAuth: true, withCredentials: true }
  );
  return response.data;
}
export const refresh=async()=>{
  return await Http.post(
    '/api/account/refresh',
    { refreshToken: getTokens()?.refreshToken },
    { skipAuth: true, withCredentials: true }
  );
}
export const getAll = async (options: GetAllOptions = {}) => {
  const {
    page = 1,
    size = 5,
    sort = "id,desc",
    filter,
    search,
    all = false,
  } = options;
  const res = await Http.get("/api/account/getAll", {
    params: { page, size, sort, filter, search, all },
  });
  return res.data;
};
