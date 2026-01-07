import { useEffect, useState } from "react"
import GuestDatesTab from "./tab/GuestTab/GuestDatesTab";
import type { ViewBookingModalProps } from "../../../type/booking.types";
import { GetBookingById } from "../../../service/api/Booking";
import RoomsSwitchTab from "./tab/RoomSwitchTab/RoomsSwitchTab";
import ServicePaymentTab from "./tab/ServicePaymentTab/ServicePaymentTab";
import { useTranslation } from "react-i18next";

const ViewBookingModal = ({ open, id, onClose }: ViewBookingModalProps) => {
    const [data, setData] = useState<any>(null);
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
        }
        fetchBooking();
    }, [open, id])
    const [activeTab, setActiveTab] = useState<"guest" | "room" | "services">
        ("guest");
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


    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center ">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden relative max-h-[80vh] flex flex-col">

                {loading && (
                    <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#1D263E] rounded-full animate-spin" />
                        <p className="mt-4 text-sm text-[#5f6b85]">
                          {t("common.loading")}
                        </p>
                    </div>
                )}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">{t("booking.viewBooking")}</h2>
                        <p className="text-sm text-gray-500">{t("booking.code")}: #{data?.code}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ✕
                    </button>
                </div>
                <div className="px-6 py-3 flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    {(() => {
                        const statusConfig = BOOKING_STATUS_MAP[data?.status];

                        if (!statusConfig) return null;

                        return (
                            <span
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium ${statusConfig.color}`}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full ${statusConfig.dot}`}
                                />
                                {t("common.status")}: {t(statusConfig.labelKey)}
                            </span>
                        );
                    })()}
                </div>
                <div className="flex-1 overflow-y-auto custom-scroll">
                    <div className="px-6 pb-1 pt-3 flex gap-6 border-b border-slate-200 text-sm sticky top-0 bg-white z-10">
                        <button
                            onClick={() => setActiveTab("guest")}
                            className={`pb-3 border-b-2 ${activeTab === "guest"
                                ? "border-[#42578E] text-[#42578E]   font-medium"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                           {t("bookingGuest.title")}
                        </button>
                        <button
                            onClick={() => setActiveTab("room")}
                            className={`pb-3 border-b-2 ${activeTab === "room"
                                ? "border-[#42578E] text-[#42578E] font-medium"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                              {t("room.title")} & {t("switchRoom.title")}
                        </button>

                        <button
                            onClick={() => setActiveTab("services")}
                            className={`pb-3 border-b-2 ${activeTab === "services"
                                ? "border-[#42578E] text-[#42578E] font-medium"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                          {t("bookingView.servicesPayments")}

                        </button>
                    </div>
                    {activeTab === "guest" && <GuestDatesTab data={data} />}
                    {activeTab === "room" && <RoomsSwitchTab data={data} />}
                    {activeTab === "services" && <ServicePaymentTab data={data} />}
                </div>

                <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-4">

                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition bg-[#42578E] text-white hover:bg-[#364a7d]"
                    >

                         {t("common.close")}
                    </button>
                </div>

            </div>
        </div>
    )
}
export default ViewBookingModal;