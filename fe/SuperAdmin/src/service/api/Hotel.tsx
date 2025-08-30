import type { GetAllOptions } from "@/type/GetAllOptions";
import Http from "../http/http";

export const AddHotel=async(hotelData:any) => {
    return await Http.post('/service/hotel/hotels/create',hotelData);
 }
 export const getAllHotel=async(options:GetAllOptions={}) => {
     const {
    page = 1,
    size = 5,
    sort = "id,desc",
    filter,
    search,
    all = false,
  } = options;
  const res = await Http.get("/service/hotel/hotels/getAll", {
    params: { page, size, sort, filter, search, all },
  });
  return res.data;
 }
export const UpdateStatusHotel = async (hotelId: number, status: "ACTIVE" | "INACTIVE") => {
  return await Http.put(`/service/hotel/hotels/updateStatus/${hotelId}`, status, {
    headers: { "Content-Type": "application/json" }
  });
};
export const updateHotel=async(hotelId:number,hotelData:any) => {
    return await Http.put(`/service/hotel/hotels/update/${hotelId}`,hotelData);
}