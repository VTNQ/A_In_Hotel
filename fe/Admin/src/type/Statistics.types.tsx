export interface BookingStatistics {
  totalNewBookings: number;
  newBookingGrowth: number;

  totalCheckIn: number;
  checkInGrowth: number;

  totalCheckOut: number;
  checkOutGrowth: number;

  totalRevenue: number;
  revenueGrowth: number;
}
export interface RoomAvailability{
    totalRooms:number;
    available:number;
    reserved:number;
    occupied:number;
    notReady:number
}
export interface RatingData {
  average: number;
  totalReviews: number;
  facilities: number;
  cleanliness: number;
  services: number;
  comfort: number;
  location: number;
}
export interface RevenueItem {
  date: string;
  revenue: number;
}
export interface ReservationItem {
  date: string;
  booked: number;
  canceled: number;
}
export interface ActivityItem {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "housekeeping" | "manager" | "reservation" | "system";
}