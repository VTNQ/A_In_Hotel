import type { ApiResponse, GetAllOptions, PageResponse } from "../../type";
import type { BookingSummaryResponse, Customer, CustomerDetail } from "../../type/customer.types";
import Http from "../http/http";

export const getCustomer = async(options:GetAllOptions={})=>{
      const {
        page = 1,
        size = 5,
        sort = "id,desc",
        hotelId,
        filter,
        searchField,
        searchValue,
        all = false,
    } = options;
    const resp = await Http.get<ApiResponse<PageResponse<Customer>>>("/api/customers/my-hotel",{
        params: { page, size, sort, filter, searchField, searchValue, all,hotelId},
    });
    return resp.data?.data;
}
export const updateStatus=async(id:number,status:boolean)=>{
    return await Http.patch<ApiResponse<void>>(`/api/customers/${id}/status?status=${status}`)

}
export const getCustomerDetail = async(id:number)=>{
    const resp = await Http.get<ApiResponse<CustomerDetail>>(`/api/customers/${id}`);
    return resp.data;

}
export const BookingSummary = async(customerId:number)=>{
    const resp = await Http.get<ApiResponse<BookingSummaryResponse>>(`/api/customers/summary?customerId=${customerId}`);
    return resp.data;
}