import type {  ApiResponseList,  } from "../../type/common";
import type { facilitiesResponse } from "../../type/facilities.types";
import Http from "../http/http";
export const getFacilities=async()=>{
  return await Http.get<ApiResponseList<facilitiesResponse>>("/api/hotels/facilities");
}