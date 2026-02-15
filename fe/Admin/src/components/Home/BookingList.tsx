import { useEffect, useState } from "react";
import { GetAllBookingTop } from "../../service/api/Booking";
import { getTokens } from "../../util/auth";
import { ChevronDown, Search } from "lucide-react";

const BookingList = () => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetAllBookingTop({
          page: 1,
          size: 5,
          filter: `booking.hotelId==${getTokens()?.hotelId}`,
        });
        setData(response?.content || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  const calculateNights = (
    checkInDate: string,
    checkInTime: string,
    checkOutDate: string,
    checkOutTime: string,
  ): number => {
    const checkIn = new Date(`${checkInDate}T${checkInTime}`);
    const checkOut = new Date(`${checkOutDate}T${checkOutTime}`);

    const diffMs = checkOut.getTime() - checkIn.getTime();

    if (diffMs <= 0) return 0;

    const ONE_NIGHT = 1000 * 60 * 60 * 24;

    return Math.ceil(diffMs / ONE_NIGHT);
  };
  const statusStyle: Record<number, string> = {
    1: "bg-blue-100 text-blue-600", // BOOKED
    2: "bg-yellow-100 text-yellow-700", // CHECKIN
    3: "bg-gray-100 text-gray-600", // CHECKOUT
    4: "bg-red-100 text-red-600", // CANCELLED
  };
  const statusLabel: Record<number, string> = {
  1: "Booked",
  2: "Checked-in",
  3: "Checked-out",
  4: "Cancelled",
};
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Booking list</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by Room Number, Room Name"
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            All status
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="pb-3">Booking ID & Guest Name</th>
              <th className="pb-3">Room type</th>
              <th className="pb-3">Room No.</th>
              <th className="pb-3">Duration</th>
              <th className="pb-3">Check in & Check out</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const nights = calculateNights(
                item.checkInDate,
                item.checkInTime,
                item.checkOutDate,
                item.checkOutTime,
              );
              return (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-4">
                    <p className="font-medium text-gray-800">
                      {item.bookingCode}
                    </p>
                    <p className="text-gray-500 text-xs">{item.guestName}</p>
                  </td>
                  <td className="py-4 text-gray-700">{item.roomType}</td>
                  <td className="py-4 text-gray-700">{item.roomNumber}</td>
                  <td className="py-4 text-gray-700">{nights}</td>
                  <td className="py-4 text-gray-700">
                    {item.checkInDate} - {item.checkOutDate}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusStyle[item.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {statusLabel[item.status] || "Unknown"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default BookingList;
