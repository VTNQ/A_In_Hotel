import type { ApiResponse, GetAllOptions, PageResponse } from "../../type";
import type { validateVoucherRequest, validateVoucherResponse, voucherFormProps, VoucherResponse } from "../../type/voucher.types";
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
    const resp = await Http.get<ApiResponse<PageResponse<VoucherResponse>>>("/api/vouchers",{
           params: { page, size, sort, filter, searchField, searchValue, all },
    });
    return resp.data;
}
export const createVoucher = async(data:voucherFormProps)=>{
    return await Http.post<ApiResponse<void>>("/api/vouchers",data)
}

export const getVoucherById = async(id:number)=>{
    return await Http.get<ApiResponse<VoucherResponse>>(`/api/vouchers/${id}`)
}

export const updateVoucher = async(id:number,data:voucherFormProps)=>{
    return await Http.put<ApiResponse<void>>(`/api/vouchers/${id}`,data)
}

export const updateVoucherStatus = async(id:number,isActive:boolean)=>{
    return await Http.patch<ApiResponse<void>>(`/api/vouchers/${id}/status?status=${isActive}`)
}
export const validateVoucher = async(data:validateVoucherRequest)=>{
    return await Http.post<ApiResponse<validateVoucherResponse>>("/api/vouchers/validate",data)
}