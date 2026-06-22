import type { ApiResponse } from "../../type/common"
import type { FranchiseResponse } from "../../type/franchise.type"
import Http from "../http/http"

export const getFranchise =async()=>{
    return await Http.get<ApiResponse<FranchiseResponse>>("/api/franchises");
}