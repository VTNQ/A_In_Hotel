import { Navigate } from "react-router-dom";
import { useBookingSearch } from "../context/booking/BookingSearchContext"

const BookingGuard = ({Children}:any)=>{
    const {search} = useBookingSearch();
    if(search === undefined) return null;
    if(!search?.hotelId || !search?.roomId || !search.checkIn || !search?.checkOut){
        return <Navigate to="/" replace/>
    }
    return Children;
}
export default BookingGuard;