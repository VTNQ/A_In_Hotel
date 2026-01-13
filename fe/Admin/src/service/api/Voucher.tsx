import type { GetAllOptions } from "../../type";
import Http from "../http/http"

export const createVoucher = async (data:any)=>{
    return await Http.post("/api/vouchers",data);
}

export const getAllVoucher = async(options:GetAllOptions={})=>{
      const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
    } = options;
    const resp = await Http.get("/api/vouchers",{
        params: { page, size, sort, filter, searchField, searchValue, all },
    });
    return resp.data;
}

export const findById = async(id:number)=>{
    return await Http.get(`/api/vouchers/${id}`)
}
export const updateVoucher = async(id:number,data:any)=>{
    return await Http.put(`/api/vouchers/${id}`,data)
}

export const updateStatus = async(id:number,status:number)=>{
    return await Http.patch(`/api/vouchers/${id}/status?status=${status}`)

}