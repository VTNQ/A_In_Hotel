import type { GetAllOptions } from "@/type/GetAllOptions";
import Http from "../http/http";

export const AddHotel = async (hotelData: any) => {
  const formData = new FormData();
  Object.entries(hotelData).forEach(([key, value]) => {
    if (key !== "image" && value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });
  if (hotelData.image) {
    formData.append("image", hotelData.image);
  }

  return await Http.post('/api/hotels/create', hotelData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
export const getAllHotel = async (options: GetAllOptions = {}) => {
  const {
    page = 1,
    size = 5,
    sort = "id,desc",
    filter,
    searchField,
    searchValue,
    all = false,
  } = options;
  const res = await Http.get("/api/hotels", {
    params: { page, size, sort, filter, searchField, searchValue, all },
  });
  return res.data;
}
export const UpdateStatusHotel = async (hotelId: number, status: 0 | 1) => {
  return await Http.put(`/api/hotels/updateStatus/${hotelId}`, status, {
    headers: { "Content-Type": "application/json" }
  });
};
export const updateHotel = async (hotelId: number, data: any) => {
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

    return await Http.put(`/api/hotels/update/${hotelId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

  } catch (err) {
    console.error("Lỗi khi tạo banner:", err);
    throw err;
  }
}

export const getHotelById = async (id: number) => {
  return await Http.get(`/api/hotels/${id}`);
}