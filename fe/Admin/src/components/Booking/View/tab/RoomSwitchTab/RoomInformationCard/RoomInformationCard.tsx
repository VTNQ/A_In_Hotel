import { BedDouble, Calendar } from "lucide-react";
import RoomLocationRow from "./RoomAllocationRow";
import { useTranslation } from "react-i18next";

const RoomInformationCard = ({ data }: any) => {
  const { t, i18n } = useTranslation();

  const formatDate = (date?: string) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString(
      i18n.language === "vi" ? "vi-VN" : "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="
      border rounded-2xl overflow-hidden
      border-slate-200 dark:border-slate-700
      bg-white dark:bg-[#111827]
    ">
      {/* HEADER */}
      <div className="
        flex items-center justify-between px-6 py-4
        bg-white dark:bg-[#111827]
        border-b border-slate-200 dark:border-slate-700
      ">
        <div className="flex items-center gap-3">
          <div className="
            p-2 rounded-lg
            bg-slate-200 dark:bg-slate-800
            text-[#1D263E] dark:text-gray-200
          ">
            <BedDouble size={18} />
          </div>

          <div>
            <h3 className="font-bold text-base text-[#1D263E] dark:text-gray-100">
              {t("bookingView.roomInformation")}
            </h3>

            <p className="text-sm text-slate-500 dark:text-gray-400">
              {t("bookingView.currentRoomAllocations")}
            </p>
          </div>
        </div>

        {/* DATE RANGE */}
        <div className="
          inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
          bg-slate-50 dark:bg-slate-800/60
          border border-slate-200 dark:border-slate-700
          text-[#1D263E] dark:text-slate-100
        ">
          <Calendar size={14} className="text-slate-500 dark:text-slate-400" />

          <span>
            {formatDate(data?.checkInDate)}
            {data?.checkOutDate && ` - ${formatDate(data.checkOutDate)}`}
          </span>
        </div>
      </div>

      {/* TABLE HEADER */}
      <div className="
        grid grid-cols-2 px-6 py-3 text-xs font-semibold
        bg-slate-50 dark:bg-slate-800/50
        border-t border-slate-200 dark:border-slate-700
        text-slate-500 dark:text-gray-400
      ">
        <div>{t("bookingView.roomName")}</div>
        <div className="text-center">
          {t("bookingView.roomType")}
        </div>
      </div>

      {/* ROWS */}
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {data?.details
          ?.filter((d: any) => d.roomId != null)
          .map((d: any, index: number) => (
            <RoomLocationRow
              key={d.roomId ?? index}
              data={d}
            />
          ))}
      </div>
    </div>
  );
};

export default RoomInformationCard;