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
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <BedDouble size={18} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-800">
              {t("bookingView.roomInformation")}
            </h3>
            <p className="text-sm text-slate-500">
              {t("bookingView.currentRoomAllocations")}
            </p>
          </div>
        </div>

        {/* DATE RANGE */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
            bg-slate-50 border border-slate-200 text-slate-700">
          <Calendar size={14} className="text-slate-500" />
          <span>
            {formatDate(data?.checkInDate)}
            {data?.checkOutDate && ` – ${formatDate(data.checkOutDate)}`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 px-6 py-2.5 text-xs font-semibold text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-wide">
        <div>{t("bookingView.roomNumber")}</div>
        <div className="text-center">{t("bookingView.roomType")}</div>
      </div>

      <div className="divide-y divide-slate-100">
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
