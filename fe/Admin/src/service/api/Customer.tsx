import type { GetAllOptions } from "../../type";
import Http from "../http/http";

export const getCustomer = async(options:GetAllOptions={})=>{
      const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
    } = options;
    const resp = await Http.get("/api/customers",{
        params: { page, size, sort, filter, searchField, searchValue, all },
    });
    return resp.data?.data;
}
export const updateStatus=async(id:number,status:boolean)=>{
    return await Http.patch(`/api/customers/${id}/status?status=${status}`)

}
export const getCustomerDetail = async(id:number)=>{
    const resp = await Http.get(`/api/customers/${id}`);
    return resp.data;

}
export const BookingSummary = async(customerId:number,hotelId:number)=>{
    const resp = await Http.get(`/api/customers/summary?customerId=${customerId}&hotelId=${hotelId}`);
    return resp.data;
}