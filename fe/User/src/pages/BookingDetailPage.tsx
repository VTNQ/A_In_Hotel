import {
  Download,
  Printer,
  User,
  Phone,
  Mail,
  ShieldCheck,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookingById } from "../service/api/bookings";
import BookingDetailSkeleton from "../components/booking/BookingDetailSkeleton";
import { BookingStatus, statusLabel, statusStyle, type BookingResponse } from "../type/booking.types";
import { useTranslation } from "react-i18next";
import { formatTime, calculateNights } from "../util/formatDate";
import Info from "../components/booking/detail/Info";
import GuestRow from "../components/booking/detail/GuestRow";
import SummaryRow from "../components/booking/detail/SummaryRow";

export default function BookingDetailPage() {
  const { t, i18n } = useTranslation();
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBooking();
  }, [id]);

  if (loading) {
    return <BookingDetailSkeleton />;
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t("booking.detail.notFound")}</h2>
          <button
            onClick={() => navigate("/my-booking")}
            className="text-primary font-bold hover:underline"
          >
            {t("booking.detail.back")}
          </button>
        </div>
      </div>
    );
  }

  const currentLang = i18n.language?.split('-')[0] || 'vi';

  const formatDate = (date: string) => new Date(date).toLocaleDateString(currentLang === 'vi' ? "vi-VN" : "en-GB", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(currentLang === 'vi' ? "vi-VN" : "en-US").format(value) + " " + t("common.vnd");

  return (
    <div className="min-h-screen bg-[#fdfbf7] dark:bg-[#121212] transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Navigation */}
        <button
          onClick={() => navigate("/my-booking")}
          className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-bold mb-8"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          {t("booking.detail.back")}
        </button>

        {/* ================= HEADER ================= */}
        <div className="mb-10 flex flex-wrap justify-between gap-6 items-end">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">
                {t("booking.card.code")}
              </span>
              <span className="text-sm font-black font-mono">#{booking.code}</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight">
              {t("booking.detail.roomInfo")}
            </h1>

            <div className="flex items-center gap-3 mt-4">
              <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusStyle(booking.status as BookingStatus)}`}>
                {t(`booking.status.${statusLabel(booking.status as BookingStatus).toLowerCase().replace(/\s/g, '')}`)}
              </span>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {booking.guestName} • {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/20 transition-all">
              <Download size={18} />
              {t("booking.detail.invoice")}
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Printer size={18} />
              {t("booking.detail.print")}
            </button>
          </div>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            {/* STAY INFO */}
            <section className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/40 shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div
                  className="h-48 md:h-auto md:w-64 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200)",
                  }}
                />

                <div className="p-8 flex-1">
                  <h3 className="text-lg font-black mb-8 flex items-center gap-2">
                    <Calendar size={20} className="text-primary" />
                    {t("booking.detail.stayInfo")}
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-8">
                    <Info
                      title={t("booking.card.checkin")}
                      main={formatDate(booking.checkInDate)}
                      sub={`${t("from")} ${formatTime(booking.checkInTime)}`}
                    />

                    <Info
                      title={t("booking.card.checkout")}
                      main={formatDate(booking.checkOutDate)}
                      sub={`${t("until")} ${formatTime(booking.checkOutTime)}`}
                    />

                    <Info
                      title={t("booking.card.guests")}
                      main={`${booking.numberOfGuests} ${t("booking.card.person")}`}
                    />

                    <Info
                      title={t("booking.detail.accommodation")}
                      main={`${calculateNights(
                        booking.checkInDate,
                        booking.checkOutDate,
                      )} ${t("booking.detail.nights")}`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ROOM DETAILS */}
            <section>
              <h3 className="text-lg font-black mb-4 px-1">{t("booking.detail.roomInfo")}</h3>

              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/40 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-white/5 text-[10px] uppercase text-slate-400 font-bold tracking-widest border-b border-slate-200 dark:border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left">{t("booking.card.room")} Name</th>
                        <th className="px-6 py-4 text-left">{t("booking.card.room")} Number</th>
                        <th className="px-6 py-4 text-center">Type</th>
                        <th className="px-6 py-4 text-right">Price / {t("booking.detail.nights")}</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {booking.details.filter((d: any) => d.roomId != null).map((room) => (
                        <tr key={room.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-6 py-5 font-bold">
                            {room.roomName}
                          </td>
                          <td className="px-6 py-5 text-slate-500">
                            {room.roomNumber}
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                              {room.roomType}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right font-bold text-primary">
                            {formatCurrency(room.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* GUEST INFO */}
            <section>
              <h3 className="text-lg font-black mb-4 px-1">{t("booking.detail.guestInfo")}</h3>

              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/40 p-8 shadow-sm space-y-6">
                <GuestRow
                  icon={<User size={18} />}
                  label={t("Full Name")}
                  value={booking.guestName}
                />
                <GuestRow
                  icon={<Phone size={18} />}
                  label={t("Phone Number")}
                  value={booking.phoneNumber}
                />
                <GuestRow
                  icon={<Mail size={18} />}
                  label={t("Email Address")}
                  value={booking.email}
                />
              </div>
            </section>
          </div>

          {/* RIGHT PAYMENT */}
          <aside className="space-y-6">
            <section className="rounded-2xl border border-primary/20 bg-primary/5 dark:bg-primary/10 p-8 shadow-sm sticky top-8">
              <h3 className="text-xl font-black mb-8">
                {t("booking.detail.paymentSummary")}
              </h3>

              <SummaryRow
                label={`${t("booking.detail.accommodation")} (${calculateNights(
                  booking.checkInDate,
                  booking.checkOutDate,
                )} ${t("booking.detail.nights")})`}
                value={formatCurrency(booking.totalPrice)}
              />

              <div className="border-t border-primary/10 pt-6 mt-6 flex justify-between items-end">
                <span className="text-sm font-bold uppercase tracking-wider text-slate-500">{t("booking.detail.grandTotal")}</span>
                <div className="text-right">
                  <span className="text-3xl font-black text-primary block leading-none">
                    {formatCurrency(booking.totalPrice)}
                  </span>
                  <span className="text-[10px] font-bold text-primary/60 uppercase">{t("booking.detail.taxIncluded")}</span>
                </div>
              </div>

              <div className="mt-10 bg-white/80 dark:bg-slate-900/50 p-5 rounded-2xl border border-primary/10 flex items-center gap-4">
                <div className="size-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-green-600 tracking-widest">{t("booking.detail.paid")}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t("booking.detail.securePayment")}</p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}


