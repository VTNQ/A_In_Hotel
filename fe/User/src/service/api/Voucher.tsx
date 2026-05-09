import Http from "../http/http"

export const validateVoucher = async(data:any)=>{
    return await Http.post("/api/vouchers/validate",data)
}