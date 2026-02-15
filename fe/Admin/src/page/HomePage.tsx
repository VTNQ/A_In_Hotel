import { useEffect, useState } from "react";
import {
  getReservation,
  getRevenueStatistics,
  getStatisticsBooking,
  getStatisticsRoomAvailability,
} from "../service/api/Statistics";
import {
  type BookingStatistics,
  type RatingData,
  type ReservationItem,
  type RevenueItem,
  type RoomAvailability,
} from "../type/Statistics.types";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck,
  DollarSign,
  LogIn,
  LogOut,
  MoreHorizontal,
} from "lucide-react";
import OverallRating from "../components/Home/OverallRating";
import RevenueChart from "../components/Home/RevenueChart";
import ReservationChart from "../components/Home/ReservationChart";
import BookingPlatformChart from "../components/Home/BookingPlatformChart";
import TasksCard from "../components/Home/TaskCard";
import BookingList from "../components/Home/BookingList";
import RecentActivities from "../components/Home/RecentActivities";

const HomePage = () => {
  const [bookingData, setBookingData] = useState<BookingStatistics | null>(
    null,
  );
  const [revervationData, setRevervationData] = useState<ReservationItem[]>([]);
  const [roomData, setRoomData] = useState<RoomAvailability | null>(null);
  const [revenue, setRevenue] = useState<RevenueItem[]>([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingRes, roomRes, revenueRes, reservationRes] =
          await Promise.all([
            getStatisticsBooking(),
            getStatisticsRoomAvailability(),
            getRevenueStatistics(),
            getReservation(),
          ]);

        setBookingData(bookingRes.data?.data);
        setRoomData(roomRes.data?.data);
        setRevervationData(reservationRes.data?.data);
        setRevenue(revenueRes.data?.data); // nếu backend trả data bọc trong data
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const ratingData: RatingData = {
    average: 4.8,
    totalReviews: 149,
    facilities: 4.6,
    cleanliness: 4.9,
    services: 4.2,
    comfort: 4.9,
    location: 4.5,
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const stats = [
    {
      title: "New Bookings",
      value: bookingData?.totalNewBookings,
      percent: bookingData?.newBookingGrowth,
      icon: CalendarCheck,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Check in",
      value: bookingData?.totalCheckIn,
      percent: bookingData?.checkInGrowth,
      icon: LogIn,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Check out",
      value: bookingData?.totalCheckOut,
      percent: bookingData?.checkOutGrowth,
      icon: LogOut,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Total Revenue",
      value: bookingData?.totalRevenue,
      percent: bookingData?.revenueGrowth,
      icon: DollarSign,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      isMoney: true,
    },
  ];

  const percentColor = (percent: any) =>
    percent >= 0 ? "text-green-500" : "text-red-500";

  return (
    <div className="flex  bg-gray-50">
      <div className="flex flex-col flex-1 overflow-hidden">
        <h1 className="text-3xl text-[48px] leading-[100%] font-bold  text-[#42578E] ">
          Good morning!
        </h1>
        <p className="text-gray-500 font-normal mt-2">{formattedDate}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100"
              >
                {/* Top */}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">{item.title}</p>

                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.iconBg}`}
                  >
                    <div className={`${item.iconColor} text-sm font-bold`}>
                      <Icon className={`${item.iconColor}`} size={18} />
                    </div>
                  </div>
                </div>

                {/* Value */}
                <h2 className="text-3xl font-semibold text-gray-800 mt-4">
                  {loading
                    ? "..."
                    : item.isMoney
                      ? item.value?.toLocaleString() + " ₫"
                      : item.value}
                </h2>

                {/* Percent */}
                {!loading && (
                  <div
                    className={`flex items-center gap-1 mt-2 text-sm ${percentColor(
                      item.percent,
                    )}`}
                  >
                    {item.percent && item.percent < 0 ? (
                      <ArrowDownRight size={16} />
                    ) : (
                      <ArrowUpRight size={16} />
                    )}
                    {item.percent?.toFixed(1)}%
                    <span className="text-gray-400 ml-1">from last week</span>
                  </div>
                )}
              </div>
            );
          })}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Room availability
              </h3>
              <MoreHorizontal
                className="text-gray-400 cursor-pointer hover:text-gray-600 transition"
                size={18}
              />
            </div>
            <p className="text-gray-500 text-sm">Total rooms</p>
            <p className="text-2xl font-semibold text-gray-800 mb-4">
              {roomData?.totalRooms}{" "}
              <span className="text-gray-400 text-base">Rooms</span>
            </p>

            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <p className="text-green-600 font-medium">
                {roomData?.available} Available
              </p>
              <p className="text-orange-500 font-medium">
                {roomData?.reserved} Reserved
              </p>
              <p className="text-blue-600 font-medium">
                {roomData?.occupied} Occupied
              </p>
              <p className="text-gray-500 font-medium">
                {roomData?.notReady} Not ready
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4  gap-6 mt-6">
          <OverallRating data={ratingData} />
          <div className="lg:col-span-2">
            <RevenueChart data={revenue} />
          </div>
          <TasksCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mt-6">
          <div className="lg:col-span-3">
            <ReservationChart data={revervationData} />
          </div>
          <div className="lg:col-span-2">
            <BookingPlatformChart />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mt-6">
          <div className="lg:col-span-5">
            <BookingList />
          </div>

          <div className="lg:col-span-2">
            <RecentActivities />
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
