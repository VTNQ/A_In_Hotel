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
  const statsMobile = [
    {
      title: "Total Revenue",
      value: bookingData?.totalRevenue,
      percent: bookingData?.revenueGrowth,
      icon: DollarSign,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      isMoney: true,
    },
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

        <div className="hidden  lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
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
        <div className="lg:hidden grid grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
          {statsMobile.map((item, index) => {
            const Icon = item.icon;
            const isRevenue = item.isMoney;

            return (
              <div
                key={index}
                className={`
        rounded-2xl transition-all
        ${
          isRevenue
            ? "col-span-3  lg:col-span-1 p-6 bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
            : "col-span-1 pt-4 pb-4 pl-2 bg-white border border-gray-100 shadow-sm min-h-[120px]"
        }
      `}
              >
                {/* Top */}
                {/* Top */}
                <div className="flex items-start gap-2 min-w-0">
                  <div
                    className={`
      w-8 h-8 shrink-0 rounded-lg flex items-center justify-center
      ${item.iconBg}
    `}
                  >
                    <Icon className={item.iconColor} size={14} />
                  </div>

                  <p
                    className={`text-xs mt-1 ${isRevenue ? "text-white" : "text-gray-800"} leading-tight break-words whitespace-normal`}
                  >
                    {item.title}
                  </p>
                </div>

                {/* Value */}
                <h2
                  className={`
          mt-2 font-semibold
          ${isRevenue ? "text-3xl" : "text-lg text-gray-800 text-right mr-2"}
        `}
                >
                  {loading
                    ? "..."
                    : isRevenue
                      ? item.value?.toLocaleString() + " ₫"
                      : item.value?.toLocaleString()}
                </h2>

                {/* Percent */}
                {!loading && (
                  <div className="mt-2 text-right">
                    {isRevenue ? (
                      // ===== Revenue layout =====
                      <div className="flex items-center gap-2 text-sm text-white">
                        <div
                          className={`
          inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium
          bg-[#FFFFFF] text-[#47B881]
        `}
                        >
                          {item.percent && item.percent < 0 ? (
                            <ArrowDownRight size={12} />
                          ) : (
                            <ArrowUpRight size={12} />
                          )}
                          {item.percent?.toFixed(1)}%
                        </div>

                        <span className="text-white/70 text-xs">
                          from last week
                        </span>
                      </div>
                    ) : (
                      // ===== Card nhỏ layout =====
                      <div
                        className={`
          inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium
          ${
            item.percent && item.percent < 0
              ? "bg-orange-100 text-orange-600"
              : "bg-blue-100 text-blue-600"
          }
        `}
                      >
                        {item.percent && item.percent < 0 ? (
                          <ArrowDownRight size={12} />
                        ) : (
                          <ArrowUpRight size={12} />
                        )}
                        {item.percent?.toFixed(1)}%
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div className="bg-white col-span-3 p-6 rounded-2xl shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#4B62A0]">
                Room availability
              </h3>
              <MoreHorizontal
                className="text-gray-400 cursor-pointer hover:text-gray-600 transition"
                size={18}
              />
            </div>

            {/* Total rooms row */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-[#707070] text-sm">Total rooms</p>
              <p className="text-lg font-semibold text-gray-800">
                {roomData?.totalRooms}
                <span className="text-gray-400 text-sm ml-1">Rooms</span>
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              {/* Left column */}
              <div className="space-y-2">
                <p className="font-medium">
                  <span className="text-green-600 mr-2 font-semibold">
                    {roomData?.available}
                  </span>
                  <span className="text-[#2B2B2B] font-medium">Available</span>
                </p>

                <p className="font-medium">
                  <span className="text-blue-600 mr-2 font-semibold">
                    {roomData?.occupied}
                  </span>
                  <span className="text-[#2B2B2B]">Occupied</span>
                </p>
              </div>

              {/* Right column */}
              <div className="space-y-2 text-right">
                <p className="font-medium">
                  <span className="text-orange-500 mr-2 font-semibold">
                    {roomData?.reserved}
                  </span>
                  <span className="text-[#2B2B2B]">Reserved</span>
                </p>

                <p className="font-medium">
                  <span className="text-gray-500 mr-2 font-semibold">
                    {roomData?.notReady}
                  </span>
                  <span className="text-[#2B2B2B]">Not ready</span>
                </p>
              </div>
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
