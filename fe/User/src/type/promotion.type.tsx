export interface PromotionRoomTypeResponse {
    roomTypeId: number;
}
export interface PromotionResponse {
    id:number;
    name:string;
    type:number;
    value:number;
    isActive:boolean;
    startDate:string;
    endDate:string;
    promotionRoomTypeResponses:PromotionRoomTypeResponse[];
}