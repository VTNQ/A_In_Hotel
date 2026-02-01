import { Repeat } from "lucide-react";
import SwitchHistoryItem from "./SwitchHistoryItem";
import { useTranslation } from "react-i18next";

const SwitchRoomHistoryCard = ({ data }: any) => {
    const {t} = useTranslation();
  return (
    <div className="border rounded-xl border-slate-200 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
          <Repeat size={18} />
        </div>
        <div>
          <h3 className="font-semibold text-[#1D263E]">
            {t("bookingView.switchRoomHistory")}
          </h3>
          <p className="text-sm text-slate-500">
            {t("bookingView.switchRoomHistoryDesc")}
          </p>
        </div>
      </div>
      {data?.roomSwitchHistories?.length > 0 ? (
        <div className="space-y-3">
          {data.roomSwitchHistories.map((item: any, index: number) => (
            <SwitchHistoryItem key={item.id ?? index} data={item} />
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-400 italic">
          {t("bookingView.noSwitchRoomHistory")}
        </div>
      )}
    </div>
  );
};
export default SwitchRoomHistoryCard;
