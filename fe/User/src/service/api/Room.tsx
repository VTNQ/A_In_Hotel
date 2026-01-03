import {  type ApiResponse, type ApiResponseList, type GetAllOptions } from "../../type/common";
import type { RoomResponse } from "../../type/room.types";
import Http from "../http/http";

export const getRoom = async(options:GetAllOptions)=>{
    const {
        page = 1,
        size = 5,
        sort = "id,desc",
        filter,
        searchField,
        searchValue,
        all = false,
    } = options;

    const resp =await Http.get("/api/rooms/getAll",{
        params: {
            page,
            size,
            sort,
            filter,
            searchField,
            searchValue,
            all,
          },
          skipAuth: true,
    })
    return resp.data;
}

export const getRepresentativeRoomsOfHotels=async()=>{
    return await Http.get<ApiResponseList<RoomResponse>>("/api/rooms/representative-by-hotel")
}

export const getRoomById = async(id:number)=>{
    return await Http.get<ApiResponse<RoomResponse>>(`/api/rooms/findById/${id}`);
}