import { Repeat } from "lucide-react";
import { useTranslation } from "react-i18next";
import SwitchHistoryItem from "./SwitchHistoryItem";

const SwitchRoomHistoryCard = ({ data }: any) => {
  const { t } = useTranslation();
  const histories = data?.roomSwitchHistories || [];

  return (
    <div className="border rounded-2xl border-slate-200 bg-white p-6 space-y-5">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-100">
          <Repeat size={18} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-800">
            {t("switchRoom.history.title")}
          </h3>
          <p className="text-sm text-slate-500">
            {t("switchRoom.history.subtitle")}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      {histories.length > 0 ? (
        <div className="space-y-3">
          {histories.map((item: any, index: number) => (
            <SwitchHistoryItem
              key={item.id ?? index}
              data={item}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
          <p className="text-sm text-slate-500">
            {t("switchRoom.history.empty")}
          </p>
        </div>
      )}
    </div>
  );
};

export default SwitchRoomHistoryCard;
