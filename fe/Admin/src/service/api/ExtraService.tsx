import type { GetAllOptions } from "../../type";
import Http from "../http/http";

export const getAll=async(options:GetAllOptions = {})=>{
   const {
    page = 1,
    size = 5,
    sort = "id,desc",
    filter,
    searchField,
    searchValue,
    all = false,
  } = options;
  const res = await Http.get("/api/extra-room-service/all",{
     params: { page, size, sort, filter, searchField, searchValue, all },
  })
  return res.data;
}
export const addExtraService=async(extraData:any) => {
    return await Http.post('/api/extra-room-service/create',extraData);
 }
 export const updateStatus=async(id:number,status:boolean)=>{
    return await Http.patch(`/api/extra-room-service/updateStatus/${id}?status=${status}`)
 }
 export const updateExtraService=async(id:number,extraData:any)=>{
  return await Http.put(`/api/extra-room-service/update/${id}`,extraData)
 }