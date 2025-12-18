import type { GetAllOptions } from "@/type/GetAllOptions";
import Http from "../http/http";

export const createBanner = async (data: any) => {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "image" && value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    if (data.image) {
      formData.append("image", data.image);
    }

    return await Http.post("/api/banners/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

  } catch (err) {
    console.error("Lỗi khi tạo banner:", err);
    throw err;
  }
}
export const getBanner = async (options: GetAllOptions = {}) => {
  const {
    page = 1,
    size = 5,
    sort = "id,desc",
    filter,
    searchField,
    searchValue,
    all = false,
  } = options;
  const res = await Http.get("/api/banners/getAll", {
    params: { page, size, sort, filter, searchField, searchValue, all },
  });
  return res.data;
}
export const findById = async (id: number) => {
  return (await Http.get(`/api/banners/${id}`)).data;
}
export const updateBanner = async (data: any, id: number) => {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "image" && value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    if (data.image) {
      formData.append("image", data.image);
    }

   return await Http.put(`/api/banners/update/${id}`, formData,{
    headers: { "Content-Type": "multipart/form-data" },
  });
   
  } catch (err) {
    console.error("Lỗi khi tạo banner:", err);
    throw err;
  }
}
export const deleteBanner = async (id: number | string) => {
  return await Http.delete(`/api/banners/${id}`);
};