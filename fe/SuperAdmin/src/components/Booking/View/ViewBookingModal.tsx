import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GetBookingById } from "@/service/api/Booking";
import {
  type BookingResponse,
  type ViewBookingModalProps,
} from "@/type/booking.types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GuestDatesTab from "./GuestTab/GuestDatesTab";
import RoomsSwitchTab from "./RoomSwitchTab/RoomsSwitchTab";
import ServicePaymentTab from "./ServicePaymentTab/ServicePaymentTab";

const ViewBookingModal = ({ open, id, onClose }: ViewBookingModalProps) => {
  const [data, setData] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    if (!open || !id) return;
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const res = await GetBookingById(id);
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [open, id]);
  const [activeTab, setActiveTab] = useState<"guest" | "room" | "services">(
    "guest",
  );
  const BOOKING_STATUS_MAP: Record<
    number,
    { labelKey: string; color: string; dot: string }
  > = {
    1: {
      labelKey: "booking.booked",
      color: "bg-[#FFDAFB80] text-[#BC00A9]",
      dot: "bg-[#BC00A9]",
    },
    2: {
      labelKey: "booking.checkIn",
      color: "bg-[#E0F2EA] text-[#36A877]",
      dot: "bg-[#33B27F]",
    },
    3: {
      labelKey: "booking.checkOut",
      color: "bg-[#F9EFCF] text-[#BE7300]",
      dot: "bg-[#BE7300]",
    },
    4: {
      labelKey: "booking.cancelled",
      color: "bg-[#FFF4F4] text-[#FF0000]",
      dot: "bg-[#FF0000]",
    },
  };
  if (!open || !id) return <></>;
  const statusConfig = data ? BOOKING_STATUS_MAP[data.status] : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="relative w-full max-w-5xl max-h-[85vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* ================= LOADING OVERLAY ================= */}
        {loading && (
          <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="mt-4 text-sm text-slate-500">{t("common.loading")}</p>
          </div>
        )}

        {/* ================= HEADER ================= */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              {t("booking.viewBooking")}
            </h2>
            <p className="text-sm text-slate-500">
              {t("booking.code")}: #{data?.code}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* ================= STATUS ================= */}
        {statusConfig && (
          <div className="px-6 py-3 border-b border-slate-200 bg-slate-50">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
              {t("common.status")}: {t(statusConfig.labelKey)}
            </span>
          </div>
        )}

        {/* ================= TABS ================= */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="flex gap-6 text-sm">
            {[
              { key: "guest", label: t("bookingGuest.title") },
              {
                key: "room",
                label: `${t("room.title")} & ${t("switchRoom.title")}`,
              },
              { key: "services", label: t("bookingView.servicesPayments") },
            ].map((tab: any) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 border-b-2 transition ${
                  activeTab === tab.key
                    ? "border-indigo-600 text-indigo-600 font-medium"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-slate-50">
          {activeTab === "guest" && (
            <div className="text-slate-700 text-sm"><GuestDatesTab data={data} /></div>
          )}

          {activeTab === "room" && (
            <div className="text-slate-700 text-sm"><RoomsSwitchTab data={data} /></div>
          )}

          {activeTab === "services" && (
            <div className="text-slate-700 text-sm">
              <ServicePaymentTab data={data}/>
            </div>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="
              px-6 py-2 rounded-xl
              text-sm font-medium
              bg-indigo-600 text-white
              hover:bg-indigo-700 transition
            "
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ViewBookingModal;
