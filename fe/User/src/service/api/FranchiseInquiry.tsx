import type { franchiseInquiryFrom } from "../../type/franchiseInquiry.type";
import Http from "../http/http";

export const createFranchiseInquiry = async(data:franchiseInquiryFrom)=>{
    return await Http.post("/api/franchise-inquiry",data);
}