
import type { GetAllOptions } from "@/type/GetAllOptions";
import Http from "../http/http";

export const getVouchers = async(options: GetAllOptions)=>{
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
export const createVoucher = async(data:any)=>{
    return await Http.post("/api/vouchers",data)
}

export const getVoucherById = async(id:number)=>{
    return await Http.get(`/api/vouchers/${id}`)
}

export const updateVoucher = async(id:number,data:any)=>{
    return await Http.put(`/api/vouchers/${id}`,data)
}

export const updateVoucherStatus = async(id:number,isActive:any)=>{
    return await Http.patch(`/api/vouchers/${id}/status?status=${isActive}`)
}
export const validateVoucher = async(data:any)=>{
    return await Http.post("/api/vouchers/validate",data)
}