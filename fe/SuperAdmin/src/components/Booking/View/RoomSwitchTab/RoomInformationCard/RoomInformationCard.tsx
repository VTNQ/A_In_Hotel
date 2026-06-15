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
      },
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <BedDouble size={18} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 dark:text-neutral-100">
              {t("bookingView.roomInformation")}
            </h3>
            <p className="text-sm text-slate-500 dark:text-neutral-400">
              {t("bookingView.currentRoomAllocations")}
            </p>
          </div>
        </div>

        {/* DATE RANGE */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
            bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-300">
          <Calendar size={14} className="text-slate-500 dark:text-neutral-400" />
          <span>
            {formatDate(data?.checkInDate)}
            {data?.checkOutDate && ` – ${formatDate(data.checkOutDate)}`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 px-6 py-2.5 text-xs font-semibold text-slate-500 dark:text-neutral-400 bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800 uppercase tracking-wide">
        <div>{t("bookingView.roomName")}</div>
        <div className="text-center">{t("bookingView.roomType")}</div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-neutral-800">
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
