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
      parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
    );
  };

  return (
    <div
      className="
        border rounded-xl p-5
        border-slate-200 dark:border-slate-700
        bg-white dark:bg-[#111827]
      "
    >
      {/* HEADER */}
      <h3 className="
        flex items-center gap-2 text-base font-semibold mb-6 pb-3
        border-b border-slate-200 dark:border-slate-700
        text-[#1D263E] dark:text-gray-100
      ">
        <User size={18} />
        {t("bookingGuest.title")}
      </h3>

      {/* CONTENT */}
      <div className="flex items-start gap-4">

        {/* AVATAR */}
        <div className="
          w-12 h-12 rounded-full
          bg-slate-100 dark:bg-gray-800
          flex items-center justify-center
          font-semibold text-slate-600 dark:text-gray-200
        ">
          {getInitials(data?.guestName)}
        </div>

        {/* INFO */}
        <div className="flex flex-col gap-1">

          {/* LABEL */}
          <div className="text-xs font-medium tracking-wide uppercase
            text-slate-400 dark:text-gray-400">
            {t("booking.guestName")}
          </div>

          {/* NAME */}
          <div className="text-lg font-semibold
            text-[#1D263E] dark:text-white">
            {data?.guestName}
          </div>

          {/* BADGES */}
          <div className="flex items-center gap-2 mt-1">

            <span className="
              inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
              bg-blue-50 dark:bg-blue-900/30
              text-blue-700 dark:text-blue-300
            ">
              {GUEST_TYPE_MAP[data?.guestType] ?? "--"}
            </span>

            <span className="
              inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium
              bg-slate-100 dark:bg-gray-800
              text-slate-700 dark:text-gray-200
            ">
              <Group size={14} />
              {t("confirmCheckIn.numberOfGuests")}: {data?.numberOfGuests}
            </span>

          </div>
        </div>
      </div>

      {/* CONTACT INFO */}
      <div className="grid grid-cols-2 gap-4 text-sm mt-5">

        <div>
          <div className="
            text-xs font-semibold uppercase tracking-wider mb-1
            text-slate-500 dark:text-gray-400
          ">
            {t("bookingGuest.phone")}
          </div>
          <div className="text-sm font-medium font-mono
            text-gray-900 dark:text-gray-100">
            {data?.phoneNumber}
          </div>
        </div>

        <div>
          <div className="
            text-xs font-semibold uppercase tracking-wider mb-1
            text-slate-500 dark:text-gray-400
          ">
            {t("bookingGuest.email")}
          </div>
          <div className="text-sm font-medium font-mono
            text-gray-900 dark:text-gray-100">
            {data?.email}
          </div>
        </div>

        <div>
          <div className="
            text-xs font-semibold uppercase tracking-wider mb-1
            text-slate-500 dark:text-gray-400
          ">
            {t("bookingGuest.idNumber")}
          </div>
          <div className="text-sm font-medium font-mono
            text-gray-900 dark:text-gray-100">
            {data?.idNumber}
          </div>
        </div>

      </div>

      {/* NOTE */}
      <div className="
        mt-5 rounded-lg border px-4 py-3
        border-yellow-200 dark:border-yellow-900/40
        bg-yellow-50 dark:bg-yellow-900/20
      ">
        <div className="
          flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider
          text-yellow-800 dark:text-yellow-300
        ">
          <StickyNote size={14} />
          {t("bookingGuest.note")}
        </div>

        <div className="
          text-sm italic
          text-slate-700 dark:text-gray-200
        ">
          {data?.note || ""}
        </div>
      </div>
    </div>
  );
};

export default GuestInformationCard;