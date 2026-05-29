import { Repeat } from "lucide-react";
import SwitchHistoryItem from "./SwitchHistoryItem";
import { useTranslation } from "react-i18next";

const SwitchRoomHistoryCard = ({ data }: any) => {
    const {t} = useTranslation();
  return (
    <div
      className="
        border rounded-xl p-6 space-y-4
        border-slate-200 dark:border-slate-700
        bg-white dark:bg-[#111827]
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div
          className="
            p-2 rounded-lg
            bg-orange-50 text-orange-600
            dark:bg-orange-900/20 dark:text-orange-300
          "
        >
          <Repeat size={18} />
        </div>

        <div>
          <h3 className="font-semibold text-[#1D263E] dark:text-gray-100">
            {t("bookingView.switchRoomHistory")}
          </h3>

          <p className="text-sm text-slate-500 dark:text-gray-400">
            {t("bookingView.switchRoomHistoryDesc")}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      {data?.roomSwitchHistories?.length > 0 ? (
        <div className="space-y-3">
          {data.roomSwitchHistories.map((item: any, index: number) => (
            <SwitchHistoryItem key={item.id ?? index} data={item} />
          ))}
        </div>
      ) : (
        <div className="
          text-sm italic
          text-slate-400 dark:text-gray-500
        ">
          {t("bookingView.noSwitchRoomHistory")}
        </div>
      )}
    </div>
  );
};
export default SwitchRoomHistoryCard;
