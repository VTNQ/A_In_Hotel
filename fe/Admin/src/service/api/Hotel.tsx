import Http from "../http/http"

export const getHotelById = async (id:number)=>{
    return await Http.get(`/api/hotels/${id}`);
}