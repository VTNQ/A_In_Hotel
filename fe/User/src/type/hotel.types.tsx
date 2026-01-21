export interface HotelResponse {
    id:number;
    name:string;
    code:string;
    address:string;
    hotlines:HotelHotlineResponse[]
}
export interface HotelHotlineResponse{
    phone:string;
}