import { Bed } from "lucide-react";
import { useTranslation } from "react-i18next";

const RoomLocationRow = ({ data }: any) => {
  const { t } = useTranslation();

  return (
    <div
      className="
        group grid grid-cols-2 items-center px-6 py-4
        transition-colors duration-150
        hover:bg-slate-50 dark:hover:bg-neutral-800
      "
    >
 
      <div className="flex items-center gap-3">
        <div
          className="
            h-10 w-10 rounded-lg
            bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400
            flex items-center justify-center
            border border-indigo-100 dark:border-indigo-900/50
            transition
            group-hover:bg-white dark:group-hover:bg-neutral-900
            group-hover:border-indigo-200 dark:group-hover:border-indigo-800
          "
        >
          <Bed size={18} />
        </div>

        <div>
          <div className="font-medium text-slate-800 dark:text-neutral-200">
            {t("bookingView.roomName")} {data?.roomName}
          </div>
          <div className="text-xs text-slate-500 dark:text-neutral-400">
            ID: #{data?.roomCode}
          </div>
        </div>
      </div>


      <div className="flex justify-center text-center">
        <div className="font-medium text-slate-700 dark:text-neutral-300 leading-tight">
          {data?.roomType}
        </div>
      </div>
    </div>
  );
};

export default RoomLocationRow;
