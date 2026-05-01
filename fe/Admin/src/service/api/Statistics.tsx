import Http from "../http/http"

export const getStatisticsBooking = async ()=>{
    return await Http.get("/api/statistics/bookings");
}
export const getStatisticsRoomAvailability = async ()=>{
    return await Http.get("/api/statistics/rooms");
}
export const getRevenueStatistics = async () => {
  return await Http.get("/api/statistics/revenue");
};
export const getReservation = async()=>{
    return await Http.get("/api/statistics/booking/reservation");

}