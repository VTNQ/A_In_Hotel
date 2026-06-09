import type { ApiResponse, GetAllOptions, PageResponse } from "../../type";
import type { bookingListTopResponse, bookingRequest, bookingResponse, checkOutRequest, SwitchRoomRequest } from "../../type/booking.types";
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
    const resp= await Http.get<ApiResponse<PageResponse<bookingResponse>>>("/api/bookings",{
        params: { page, size, sort, filter, searchField, searchValue, all },
    });
    return resp.data.data;
}
export const GetAllBookingTop = async(options:GetAllOptions={})=>{
    const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
    } = options;
    const resp= await Http.get<ApiResponse<PageResponse<bookingListTopResponse>>>("/api/bookings/top",{
        params: { page, size, sort, filter, searchField, searchValue, all },
    });
    return resp.data.data;
}

export const createBooking =async(booking:bookingRequest)=>{
    return await Http.post("/api/bookings",booking);

}

export const GetBookingById =async(id:number)=>{
    return await Http.get<ApiResponse<bookingResponse>>(`/api/bookings/${id}`);
}

export const findByIdAndDetailsActiveTrue = async(id:number)=>{
    return await Http.get<ApiResponse<void>>(`/api/bookings/${id}/active-details`);
}

export const handleCheckIn =async(id:number)=>{
    return await Http.patch<ApiResponse<void>>(`/api/bookings/${id}/check-in`)
}

export const handleCheckOut =async(id:number,data:checkOutRequest)=>{
    return await Http.patch<ApiResponse<void>>(`/api/bookings/${id}/check-out`,data)

}

export const handleSwitchRoom = async (id: number, data: SwitchRoomRequest) =>{
    return await Http.patch<ApiResponse<void>>(`/api/bookings/${id}/switch-room`, data);

}

export const cancelBooking = async (id:number)=>{
    return await Http.patch<ApiResponse<void>>(`/api/bookings/${id}/cancel`)
}

export const approveBooking = async(id:number)=>{
    return await Http.patch<ApiResponse<void>>(`/api/bookings/approve/${id}`);
}

export const rejectBooking = async(id:number)=>{
    return await Http.patch<ApiResponse<void>>(`/api/bookings/reject/${id}`);
}