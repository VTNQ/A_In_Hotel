import type { ApiResponse } from "../../type/common"
import type { SystemContent } from "../../type/systemContent.types"
import Http from "../http/http"

export const getByContentKey = async(id:number)=>{
    return await Http.get<ApiResponse<SystemContent>>(`/api/system-content/${id}`,{
        skipAuth: true,
        withCredentials: true,
    })
}