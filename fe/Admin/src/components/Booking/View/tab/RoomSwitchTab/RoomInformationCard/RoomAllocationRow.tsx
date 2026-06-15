import { Bed } from "lucide-react";
import { useTranslation } from "react-i18next";

const RoomLocationRow = ({ data }: any) => {
  const { t } = useTranslation();

  return (
    <div
      className="
        group grid grid-cols-2 px-6 py-4 items-center
        border-t border-slate-200 dark:border-slate-700
        transition-colors duration-150
        hover:bg-slate-50 dark:hover:bg-slate-800/60
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div
          className="
            h-10 w-10 rounded-lg flex items-center justify-center
            bg-indigo-50 dark:bg-indigo-900/20
            text-primary dark:text-indigo-400
            border border-indigo-100 dark:border-indigo-800/30
            group-hover:bg-white dark:group-hover:bg-indigo-900/30
            group-hover:border-indigo-200 dark:group-hover:border-indigo-700
            transition-all
          "
        >
          <Bed size={18} />
        </div>

        <div>
          <div className="font-semibold text-[#1D263E] dark:text-gray-100">
             {t("bookingView.roomName")} {data?.roomName}
          </div>

          <div className="text-xs text-slate-500 dark:text-gray-400">
            ID: #{data?.roomCode}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center text-center">
        <div className="font-semibold text-[#1D263E] dark:text-gray-200 leading-tight">
          {data?.roomType}
        </div>
      </div>
    </div>
  );
};

export default RoomLocationRow;