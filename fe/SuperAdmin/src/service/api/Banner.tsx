import type { GetAllOptions } from "@/type/GetAllOptions";
import Http from "../http/http";

export const createBanner=async( bannerDTO: Record<string, any>,image:File | null)=>{
    try {
    const formData = new FormData();

    // spread bannerDTO vào FormData
    for (const [k, v] of Object.entries(bannerDTO)) {
      formData.append(k, v instanceof Date ? v.toISOString() : String(v));
    }

    if (image) formData.append("image", image);

    const { data } = await Http.post("/api/banners/create", formData);
    return data;
  } catch (err) {
    console.error("Lỗi khi tạo banner:", err);
    throw err;
  }
}
export const getBanner=async(options:GetAllOptions={})=>{
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
    params: { page, size, sort, filter, searchField,searchValue, all },
  });
  return res.data;
}
export const findById=async(id:number)=>{
  return (await Http.get(`/api/banners/${id}`)).data; 
}
export const updateBanner=async(bannerDTO: Record<string, any>,image:File | null,id:number)=>{
      try {
    const formData = new FormData();

    // spread bannerDTO vào FormData
    for (const [k, v] of Object.entries(bannerDTO)) {
      formData.append(k, v instanceof Date ? v.toISOString() : String(v));
    }

    if (image) formData.append("image", image);

    const { data } = await Http.put(`/api/banners/update/${id}`, formData);
    return data;
  } catch (err) {
    console.error("Lỗi khi tạo banner:", err);
    throw err;
  }
}