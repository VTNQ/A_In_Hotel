import {
  Download,
  Printer,
  User,
  Phone,
  Mail,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookingById } from "../service/api/bookings";
import BookingDetailSkeleton from "../components/booking/BookingDetailSkeleton";

/* ================= TYPES ================= */

interface BookingDetailResponse {
  id: number;
  roomName: string;
  roomNumber: string;
  roomType: string;
  price: number;
}

interface BookingResponse {
  id: number;
  guestName: string;
  phoneNumber: string;
  email: string;
  numberOfGuests: number;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  totalPrice: number;
  status: number;
  details: BookingDetailResponse[];
}

/* ================= PAGE ================= */

export default function BookingDetailPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await getBookingById(Number(id));
        setBooking(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBooking();
  }, [id]);
  

  if (loading) {
    return <BookingDetailSkeleton/>;
  }

  if (!booking) {
    return <div className="p-10 text-center">Booking not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f7f6] px-6 py-10 lg:px-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        {/* ================= HEADER ================= */}
        <div className="mb-10 flex flex-wrap justify-between gap-6 items-center">
          <div>
            <h1 className="font-serif text-4xl font-bold">
              Reservation Details
            </h1>

            <div className="flex items-center gap-3 mt-3">
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                Confirmed
              </span>

              <p className="text-sm text-slate-500">
                {booking.guestName} • {formatDate(booking.checkInDate)} -{" "}
                {formatDate(booking.checkOutDate)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-primary/20 transition">
              <Download size={18} />
              Download Invoice
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
            >
              <Printer size={18} />
              Print Summary
            </button>
          </div>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            {/* STAY INFO */}
            <section className="rounded-xl border bg-white shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div
                  className="h-48 md:w-64 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200)",
                  }}
                />

                <div className="p-6 flex-1">
                  <h3 className="font-serif text-xl font-bold mb-6">
                    Stay Information
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <Info
                      title="Check-in"
                      main={formatDate(booking.checkInDate)}
                      sub={`From ${formatTime(booking.checkInTime)}`}
                    />

                    <Info
                      title="Check-out"
                      main={formatDate(booking.checkOutDate)}
                      sub={`Until ${formatTime(booking.checkOutTime)}`}
                    />

                    <Info
                      title="Guests"
                      main={`${booking.numberOfGuests} Guests`}
                    />

                    <Info
                      title="Total Duration"
                      main={`${calculateNights(
                        booking.checkInDate,
                        booking.checkOutDate,
                      )} Nights`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ROOM DETAILS */}
            <section>
              <h3 className="font-serif text-xl font-bold mb-4">
                Room Details
              </h3>

              <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-primary/5 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4 text-left">Room Name</th>
                      <th className="px-6 py-4 text-left">Room Number</th>
                      <th className="px-6 py-4 text-center">Type</th>
                      <th className="px-6 py-4 text-right">Price / Night</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {booking.details.filter((d:any)=>d.roomId!=null).map((room) => (
                      <tr key={room.id}>
                        <td className="px-6 py-5 font-medium">
                          {room.roomName}
                        </td>
                        <td className="px-6 py-5 text-slate-500">
                          {room.roomNumber}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded text-xs uppercase">
                            {room.roomType}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right font-semibold">
                          {formatCurrency(room.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* GUEST INFO */}
            <section>
              <h3 className="font-serif text-xl font-bold mb-4">
                Guest Information
              </h3>

              <div className="rounded-xl border bg-white p-6 shadow-sm space-y-5">
                <GuestRow
                  icon={<User size={18} />}
                  label="Full Name"
                  value={booking.guestName}
                />
                <GuestRow
                  icon={<Phone size={18} />}
                  label="Phone Number"
                  value={booking.phoneNumber}
                />
                <GuestRow
                  icon={<Mail size={18} />}
                  label="Email Address"
                  value={booking.email}
                />
              </div>
            </section>
          </div>

          {/* RIGHT PAYMENT */}
          <aside className="space-y-6">
            <section className="rounded-xl border bg-primary/5 p-8 shadow-sm">
              <h3 className="font-serif text-2xl font-bold mb-6">
                Payment Summary
              </h3>

              <SummaryRow
                label={`Accommodation (${calculateNights(
                  booking.checkInDate,
                  booking.checkOutDate,
                )} Nights)`}
                value={formatCurrency(booking.totalPrice)}
              />

              <div className="border-t pt-6 mt-6 flex justify-between items-end">
                <span className="text-lg font-bold">Grand Total</span>
                <span className="text-3xl font-serif font-bold text-primary">
                  {formatCurrency(booking.totalPrice)}
                </span>
              </div>

              <div className="mt-8 bg-white/70 p-4 rounded-lg border flex items-center gap-3">
                <ShieldCheck className="text-primary" />
                <div className="text-xs">
                  <p className="font-bold uppercase">Paid in Full</p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => navigate("/my-booking")}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-semibold"
        >
          <ArrowLeft size={18} />
          Back to My Bookings
        </button>

      
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

const formatDate = (date: string) => new Date(date).toLocaleDateString("en-GB");

const formatTime = (time: string) => time?.slice(0, 5);

const formatCurrency = (value: number) =>
  `$${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })}`;

const calculateNights = (checkIn: string, checkOut: string) => {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diff = outDate.getTime() - inDate.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
function Info({ title, main, sub }: any) {
  return (
    <div>
      <p className="text-xs uppercase text-slate-400 font-bold">{title}</p>
      <p className="font-medium">{main}</p>
      {sub && <p className="text-sm text-slate-500">{sub}</p>}
    </div>
  );
}
function GuestRow({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-primary/10 text-primary p-2 rounded-lg">{icon}</div>
      <div>
        <p className="text-xs uppercase text-slate-400 font-bold">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm mb-4">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
