import type { GetAllOptions } from "@/type/GetAllOptions";
import Http from "../http/http";

export const getFranchiseSectionItem = async(options:GetAllOptions={})=>{
     const {
    page = 1,
    size = 5,
    sort = "id,desc",
    filter,
    searchField,
    searchValue,
    all = false,
  } = options;
  const resp = await Http.get("/api/franchise-section-item",{
        params: { page, size, sort, filter, searchField, searchValue, all },
  });
  return resp.data;
}
export const createFranchiseSectionItem = async(data:any)=>{
    const formData = new FormData();
   Object.entries(data).forEach(([key, value]) => {
      if (key !== "image" && value !== undefined && value !== null) {
          formData.append(key, value.toString());
      }
  });
   if (data.image) {
      formData.append("image", data.image);
  }
  return await Http.post("/api/franchise-section-item", formData, {
      headers: { "Content-Type": "multipart/form-data" },
  });

}
export const getFranchiseSectionItemById = async(id:number)=>{
  return await Http.get(`/api/franchise-section-item/${id}`);
}
export const updateFranchiseSectionItem = async(data:any,id:number)=>{
      const formData = new FormData();
   Object.entries(data).forEach(([key, value]) => {
      if (key !== "image" && value !== undefined && value !== null) {
          formData.append(key, value.toString());
      }
  });
   if (data.image) {
      formData.append("image", data.image);
  }
  return await Http.put(`/api/franchise-section-item/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
  });

}