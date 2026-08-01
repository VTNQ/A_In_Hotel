import {
  BedDouble,
  Calendar,
  DoorOpen,
  User,
  Users,
  ChevronRight,
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  BookingStatus,
  statusLabel,
  statusStyle,
  type TabKey,
} from "../type/booking.types";
import { cancelBook, getBookings } from "../service/api/bookings";
import InfoBooking from "../components/booking/InfoBooking";
import { useNavigate } from "react-router-dom";
import BookingCardSkeleton from "../components/booking/BookingCardSkeleton";
import { useAlert } from "../components/alert-context";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const MyBookingsPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("UPCOMING");
  const [bookings, setBookings] = useState<any[]>([]);
  const [cancelLoadingId, setCancelLoadingId] = useState<number | null>(null);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resp = await getBookings({
        all: true,
      });
      setBookings(resp.data?.content || resp.content || []);
    } catch (err) {
      console.error(err);
      showAlert({
        title: t("booking.alerts.loadFailed"),
        type: "error",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const TABS = [
    { key: "UPCOMING", label: t("booking.tabs.upcoming"), icon: Clock },
    {
      key: "COMPLETED",
      label: t("booking.tabs.completed"),
      icon: CheckCircle2,
    },
    { key: "CANCELLED", label: t("booking.tabs.cancelled"), icon: XCircle },
  ] as const;

  const cancelBooking = async (id: number) => {
    if (!window.confirm(t("booking.card.cancelConfirm"))) return;
    try {
      setCancelLoadingId(id);
      await cancelBook(id);
      showAlert({
        title: t("booking.alerts.cancelSuccess"),
        type: "success",
        autoClose: 3000,
      });
      fetchData();
    } catch (err) {
      console.error(err);
      showAlert({
        title: t("booking.alerts.cancelFailed"),
        type: "error",
        autoClose: 3000,
      });
    } finally {
      setCancelLoadingId(null);
    }
  };

  const filteredBookings = useMemo(() => {
    switch (activeTab) {
      case "UPCOMING":
        return bookings.filter(
          (b) =>
            b.status === BookingStatus.BOOKED ||
            b.status === BookingStatus.CHECKIN,
        );
      case "COMPLETED":
        return bookings.filter((b) => b.status === BookingStatus.CHECKOUT);
      case "CANCELLED":
        return bookings.filter((b) => b.status === BookingStatus.CANCELLED);
      default:
        return bookings;
    }
  }, [bookings, activeTab]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] dark:bg-[#121212] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-black tracking-tight mb-3">
              {t("booking.title")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              {t("booking.subtitle")}
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-white/10 mb-10 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative pb-4 px-6 text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? "text-primary"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8">
            {loading ? (
              <div className="flex flex-col gap-6">
                {[1, 2, 3].map((i) => (
                  <BookingCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {filteredBookings.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/20 p-16 text-center shadow-sm"
                  >
                    <div className="bg-slate-100 dark:bg-slate-800 size-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                      <Inbox size={40} />
                    </div>
                    <p className="text-xl font-bold mb-2">
                      {t("booking.empty.title")}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                      {t("booking.empty.description")}
                    </p>
                    <button
                      onClick={() => navigate("/Room")}
                      className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                    >
                      {t("booking.empty.button")}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-6"
                  >
                    {filteredBookings.map((b) => (
                      <motion.div
                        layout
                        key={b.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`group rounded-2xl border transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-primary/5 ${
                          b.status === BookingStatus.CANCELLED
                            ? "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-white/5 opacity-80"
                            : "bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/10"
                        }`}
                      >
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between p-6 bg-slate-50/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 gap-4">
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                                {t("booking.card.code")}
                              </span>
                              <span className="text-lg font-black font-mono">
                                #{b.code}
                              </span>
                            </div>

                            <div className="h-8 w-px bg-slate-200 dark:bg-white/10 hidden sm:block mx-2" />

                            <span
                              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${statusStyle(
                                b.status,
                              )}`}
                            >
                              {t(
                                `booking.status.${b.status?.toLowerCase() ?? "unknown"}`,
                              )}
                            </span>
                          </div>

                          <div className="sm:text-right flex flex-col justify-center">
                            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                              {t("booking.card.total")}
                            </span>
                            <span className="text-2xl font-black text-primary">
                              {formatPrice(b.totalPrice)}{" "}
                              <span className="text-sm font-normal">
                                {t("common.vnd")}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 grid lg:grid-cols-12 gap-8">
                          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <InfoBooking
                              icon={
                                <Calendar className="text-primary" size={16} />
                              }
                              label={t("booking.card.checkin")}
                              value={`${b.checkInDate} • ${b.checkInTime?.slice(0, 5)}`}
                            />

                            <InfoBooking
                              icon={
                                <Calendar className="text-primary" size={16} />
                              }
                              label={t("booking.card.checkout")}
                              value={`${b.checkOutDate} • ${b.checkOutTime?.slice(0, 5)}`}
                            />

                            <InfoBooking
                              icon={<User className="text-primary" size={16} />}
                              label={t("booking.card.guest")}
                              value={b.guestName}
                            />

                            <InfoBooking
                              icon={
                                <Users className="text-primary" size={16} />
                              }
                              label={t("booking.card.guests")}
                              value={`${b.numberOfGuests} ${t("booking.card.person")}`}
                            />
                          </div>

                          <div className="lg:col-span-4">
                            <div className="bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-200 dark:border-white/5 h-full">
                              <p className="text-[10px] uppercase text-slate-400 font-bold mb-4 tracking-wider">
                                {t("booking.card.details")}
                              </p>

                              <div className="space-y-4">
                                {b.details
                                  ?.filter((d: any) => d.roomId != null)
                                  .map((room: any, i: number) => (
                                    <div
                                      key={i}
                                      className="flex items-center gap-4"
                                    >
                                      <div className="size-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary border border-slate-100 dark:border-white/5">
                                        {i === 0 ? (
                                          <BedDouble size={20} />
                                        ) : (
                                          <DoorOpen size={20} />
                                        )}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate">
                                          {room.roomName}
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium">
                                          {t("booking.card.room")}:{" "}
                                          {room.roomNumber}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-slate-50/30 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex flex-wrap justify-end gap-3">
                          {b.status === BookingStatus.BOOKED && (
                            <button
                              onClick={() => cancelBooking(b.id)}
                              disabled={cancelLoadingId === b.id}
                              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border
                                ${
                                  cancelLoadingId === b.id
                                    ? "bg-red-50 dark:bg-red-900/10 border-red-200 text-red-400 cursor-allowed"
                                    : "bg-white dark:bg-slate-800 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                }`}
                            >
                              {cancelLoadingId === b.id ? (
                                <>
                                  <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                                  {t("booking.card.cancelling")}
                                </>
                              ) : (
                                t("booking.card.cancel")
                              )}
                            </button>
                          )}

                          <button
                            onClick={() => navigate(`/my-booking/${b.id}`)}
                            className="px-8 py-2 rounded-xl bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                          >
                            {t("booking.card.viewDetails")}
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
