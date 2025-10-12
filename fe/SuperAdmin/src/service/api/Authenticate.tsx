import type { GetAllOptions } from "@/type/GetAllOptions";
import Http from "../http/http"
import { getTokens } from "@/util/auth";

export const login = async (username: string, password: string) => {
  const response = await Http.post(
    '/api/account/login',
    { username, password },
    { skipAuth: true, withCredentials: true }
  );
  return response.data;
}
export const refresh = async () => {
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
    searchField,
    searchValue,
    all = false,
  } = options;
  const res = await Http.get("/api/account/getAll", {
    params: { page, size, sort, filter, searchField, searchValue, all },
  });
  return res.data;
};
export const register = async (register: Record<string, any>, image: File | null) => {
  try {
    const formData = new FormData();

    // spread bannerDTO vào FormData
    for (const [k, v] of Object.entries(register)) {
      formData.append(k, v instanceof Date ? v.toISOString() : String(v));
    }

    if (image) formData.append("image", image);

    const { data } = await Http.post(`/api/account/register`, formData);
    return data;
  } catch (err) {
    console.error("Lỗi khi tạo banner:", err);
    throw err;
  }
}