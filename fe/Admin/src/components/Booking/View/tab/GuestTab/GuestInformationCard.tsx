import { Group, StickyNote, User } from "lucide-react";
import { GUEST_TYPE_MAP } from "../../../../../type/booking.types";
import { useTranslation } from "react-i18next";

const GuestInformationCard = ({ data }: any) => {
    const { t } = useTranslation();
    const getInitials = (name?: string) => {
        if (!name) return "?";

        const parts = name.trim().split(" ").filter(Boolean);

        if (parts.length === 1) {
            return parts[0][0].toUpperCase();
        }

        return (
            parts[0][0].toUpperCase() +
            parts[1][0].toUpperCase()
        );
    };

    return (
        <div className="border rounded-xl border-slate-200 p-5">
            {/* HEADER */}
            <h3 className="flex items-center gap-2 text-base font-semibold text-[#1D263E] mb-6 border-b border-slate-200 pb-3">
                <User size={18} /> {t("bookingGuest.title")}
            </h3>

            {/* CONTENT */}
            <div className="flex items-start gap-4">
                {/* AVATAR */}
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-600">
                    {getInitials(data?.guestName)}
                </div>

                {/* INFO */}
                <div className="flex flex-col gap-1">
                    {/* LABEL */}
                    <div className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                         {t("booking.guestName")}
                    </div>

                    {/* NAME */}
                    <div className="text-lg font-semibold text-[#1D263E]">
                        {data?.guestName}
                    </div>

                    {/* BADGES */}
                    <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                            {GUEST_TYPE_MAP[data?.guestType] ?? "--"}
                        </span>

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                            <Group size={14} />
                              {t("confirmCheckIn.numberOfGuests")}: {data?.numberOfGuests}
                        </span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mt-5">
                <div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-muted-dark uppercase tracking-wider mb-1"> {t("bookingGuest.phone")}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                        {data?.phoneNumber}
                    </div>
                </div>
                <div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-muted-dark uppercase tracking-wider mb-1">{t("bookingGuest.email")}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                        {data?.email}
                    </div>
                </div>
                <div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-muted-dark uppercase tracking-wider mb-1">{t("bookingGuest.idNumber")}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                        {data?.idNumber}
                    </div>
                </div>
            </div>
            <div className="mt-5 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
                <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-yellow-800">
                    <StickyNote size={14} />
                     {t("bookingGuest.note")}
                </div>

                <div className="text-sm italic text-slate-700">
                    {data?.note || ""}
                </div>
            </div>
        </div>
    );
};

export default GuestInformationCard;
