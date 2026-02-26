import { BedDouble, Calendar, DoorOpen, User, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  BookingStatus,
  statusLabel,
  statusStyle,
  type BookingStatusTab,
} from "../type/booking.types";
import { getBookings } from "../service/api/bookings";
import InfoBooking from "../components/booking/InfoBooking";
import { useNavigate } from "react-router-dom";
const MyBookingsPage = () => {
  const [activeTab, setActiveTab] = useState<BookingStatusTab>("BOOKED");
  const [bookings, setBookings] = useState<any[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getBookings({
          all: true,
        });
        setBookings(resp.data.content || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const BOOKING_TABS: BookingStatusTab[] = [
    "BOOKED",
    "CHECKIN",
    "CHECKOUT",
    "CANCELLED",
  ];
  const filteredBookings = useMemo(() => {
    switch (activeTab) {
      case "BOOKED":
        return bookings.filter((b) => b.status === BookingStatus.BOOKED);

      case "CHECKIN":
        return bookings.filter((b) => b.status === BookingStatus.CHECKIN);

      case "CHECKOUT":
        return bookings.filter((b) => b.status === BookingStatus.CHECKOUT);
      case "CANCELLED":
        return bookings.filter((b) => b.status === BookingStatus.CANCELLED);

      default:
        return bookings;
    }
  }, [bookings, activeTab]);

  return (
    <div
      className="min-h-screen bg-[#fdfbf7] dark:bg-[#121212] text-slate-800
  dark:text-slate-100 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight">
            My Reservations
          </h1>
          <p className="text-slate-500 text-lg">
            Manage your luxury stays and booking history effortlessly.
          </p>

          <div className="flex border-b border-primary/10 mb-8 gap-8 text-sm font-bold mt-5">
            {BOOKING_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400 hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            {loading && (
              <>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-xl border bg-white p-6 shadow-sm"
                  >
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                ))}
              </>
            )}
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className={`rounded-xl border shadow-sm overflow-hidden ${
                  b.status === BookingStatus.CANCELLED
                    ? "opacity-70 grayscale"
                    : "bg-white dark:bg-slate-800/40"
                }`}
              >
                <div className="flex justify-between px-6 py-4 bg-primary/5 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <span className="text-xs uppercase text-slate-400 font-bold">
                      Booking Code
                    </span>
                    <span className="text-lg font-extrabold">{b.code}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusStyle(
                        b.status,
                      )}`}
                    >
                      {statusLabel(b.status)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs uppercase text-slate-400 font-bold block">
                      Total Price
                    </span>
                    <span className="text-xl font-black text-primary">
                      {b.totalPrice} VND
                    </span>
                  </div>
                </div>
                <div className="p-6 grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 grid grid-cols-2 gap-y-6">
                    <InfoBooking
                      icon={<Calendar size={14} />}
                      label="Check-in"
                      value={`${b.checkInDate} • ${b.checkInTime?.slice(0, 5)}`}
                    />
                    <InfoBooking
                      icon={<Calendar size={14} />}
                      label="Check-out"
                      value={`${b.checkOutDate} • ${b.checkOutTime?.slice(0, 5)}`}
                    />
                    <InfoBooking
                      icon={<User size={14} />}
                      label="Guest Name"
                      value={b.guestName}
                    />
                    <InfoBooking
                      icon={<Users size={14} />}
                      label="Guests"
                      value={b.numberOfGuests}
                    />
                  </div>
                  <div className="bg-[#f7f7f6] dark:bg-slate-900/50 rounded-lg p-4 border">
                    <p className="text-xs uppercase text-slate-400 font-bold mb-3">
                      Room Details
                    </p>
                    {b.details
                      ?.filter((d: any) => d.roomId != null)
                      .map((room: any, i: number) => (
                        <div key={i} className="flex gap-3 mb-3">
                          <div className="size-9 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                            {i === 0 ? (
                              <BedDouble size={16} />
                            ) : (
                              <DoorOpen size={16} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{room.roomName}</p>
                            <p className="text-xs text-primary font-medium">
                              {room.roomNumber}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="px-6 py-4 border-t flex justify-end gap-3">
                  {b.status === BookingStatus.BOOKED && (
                    <button className="px-6 h-10 rounded-lg border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50">
                      Cancel Booking
                    </button>
                  )}

                  <button
                    onClick={() => navigate(`/my-booking/${b.id}`)}
                    className="px-6 h-10 rounded-lg bg-primary text-white text-sm font-bold shadow-sm hover:bg-primary/90"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyBookingsPage;
