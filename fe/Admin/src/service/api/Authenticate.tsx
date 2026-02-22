import Http from "../http/http";
import { getTokens } from "../../util/auth";
import type { GetAllOptions } from "../../type";

export const login = async (username: string, password: string) => {
  const response = await Http.post(
    "/api/account/login",
    { username, password },
    { skipAuth: true, withCredentials: true },
  );
  return response.data;
};
export const refresh = async () => {
  return await Http.post(
    "/api/account/refresh",
    { refreshToken: getTokens()?.refreshToken },
    { skipAuth: true, withCredentials: true },
  );
};
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
export const register = async (
  register: Record<string, any>,
  image: File | null,
) => {
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
};
export const getProfile = async () => {
  return await Http.get("/api/account/me/profile");
};
export const updateProfile = async (data: any) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key !== "image" && value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });
  if (data.image) {
    formData.append("image", data.image);
  }
  return await Http.patch("/api/account/me", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const changePassword = async (data:any)=>{
  return await Http.put("/api/account/me/password",data)
}