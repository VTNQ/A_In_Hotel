import type { GetAllOptions } from "../../type";
import Http from "../http/http";

export const getAllRoom = async (options: GetAllOptions = {}) => {
    const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
    } = options;
    const resp = await Http.get("/api/rooms/getAll", {
        params: { page, size, sort, filter, searchField, searchValue, all },
    });
    return resp.data;
}
export const createRoom = async (roomData: any) => {
    const formData = new FormData();
    Object.entries(roomData).forEach(([key, value]) => {
        if (key !== "images") formData.append(key, String(value));
    });
    roomData.images?.forEach((img:File)=>formData.append("image",img))
    return await Http.post("/api/rooms/create",formData,{
        headers: { "Content-Type": "multipart/form-data" },
    })
}
export const updateRoom = async (id:number,roomData: any) => {
    const formData = new FormData();
    Object.entries(roomData).forEach(([key, value]) => {
        if (key !== "images") formData.append(key, String(value));
    });
    roomData.images?.forEach((img:File)=>formData.append("image",img))
    return await Http.put(`/api/rooms/update/${id}`,formData,{
        headers: { "Content-Type": "multipart/form-data" },
    })
}
export const updateStatus = async (id:number,status:number)=>{
    return await Http.patch(`/api/rooms/updateStatus/${id}?status=${status}`)

}