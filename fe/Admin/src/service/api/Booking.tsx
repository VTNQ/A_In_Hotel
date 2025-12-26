import type { GetAllOptions } from "../../type";
import Http from "../http/http";

export const GetAllBookings = async(options:GetAllOptions={})=>{
    const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
    } = options;
    const resp= await Http.get("/api/bookings",{
        params: { page, size, sort, filter, searchField, searchValue, all },
    });
    return resp.data.data;
}

export const createBooking =async(booking:any)=>{
    return await Http.post("/api/bookings",booking);

}

export const GetBookingById =async(id:number)=>{
    return await Http.get(`/api/bookings/${id}`);
}

export const handleCheckIn =async(id:number)=>{
    return await Http.patch(`/api/bookings/${id}/check-in`)
}

export const handleCheckOut =async(id:number,data:any)=>{
    return await Http.patch(`/api/bookings/${id}/check-out`,data)

}