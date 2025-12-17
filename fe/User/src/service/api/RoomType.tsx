import {  type ApiResponseList } from "../../type/common"
import type { RooTypeResponse } from "../../type/roomType.types"
import Http from "../http/http"

export const getRoomTypeByHotel=async(id:number)=>{
    return await Http.get<ApiResponseList<RooTypeResponse>>(`/api/hotels/${id}/room-types`);
}