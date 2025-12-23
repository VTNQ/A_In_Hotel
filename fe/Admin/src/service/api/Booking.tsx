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