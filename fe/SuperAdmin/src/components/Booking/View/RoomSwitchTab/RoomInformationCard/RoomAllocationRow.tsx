import { Bed } from "lucide-react";
import { useTranslation } from "react-i18next";

const RoomLocationRow = ({ data }: any) => {
  const { t } = useTranslation();

  return (
    <div
      className="
        group grid grid-cols-2 items-center px-6 py-4
        transition-colors duration-150
        hover:bg-slate-50
      "
    >
 
      <div className="flex items-center gap-3">
        <div
          className="
            h-10 w-10 rounded-lg
            bg-indigo-50 text-indigo-600
            flex items-center justify-center
            border border-indigo-100
            transition
            group-hover:bg-white
            group-hover:border-indigo-200
          "
        >
          <Bed size={18} />
        </div>

        <div>
          <div className="font-medium text-slate-800">
            {t("bookingView.roomNumber")} {data?.roomNumber}
          </div>
          <div className="text-xs text-slate-500">
            ID: #{data?.roomCode}
          </div>
        </div>
      </div>


      <div className="flex justify-center text-center">
        <div className="font-medium text-slate-700 leading-tight">
          {data?.roomType}
        </div>
      </div>
    </div>
  );
};

export default RoomLocationRow;
