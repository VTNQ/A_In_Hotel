import type { GetAllOptions } from "../../type";
import Http from "../http/http";

export const getAllStaff=async(options:GetAllOptions={})=>{
    const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
    } = options;
    const resp=await Http.get("/api/staffs/getAll",{
        params: { page, size, sort, filter, searchField, searchValue, all },
    })
    return resp.data;
}
export const create=async(staff:any)=>{
    return await Http.post("/api/staffs/create",staff)
}
export const updateStatus=async(id:number,status:boolean)=>{
    return await Http.patch(`/api/staffs/updateStatus/${id}?status=${status}`)
}