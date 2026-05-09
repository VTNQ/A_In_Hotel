import { Navigate } from "react-router-dom";
import { useBookingSearch } from "../context/booking/BookingSearchContext";

const BookingGuard = ({ children }: any) => {
    const { search } = useBookingSearch();

    console.log(search);

    if (search === undefined) return null;

    if (
        !search?.hotelId ||
        !search?.roomId ||
        !search?.checkIn ||
        !search?.checkOut
    ) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default BookingGuard;