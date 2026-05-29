import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

const BillSummaryCard = ({ data }: any) => {
    const { t } = useTranslation();
    const formatMoney = (v: number) =>
        `${v < 0 ? "-" : ""}${Math.abs(v).toLocaleString("vi-VN")}`;
    const RoomTotal = data?.details
        ?.filter((d: any) => d.roomId != null)
        .reduce((sum: number, d: any) => sum + (d.price ?? 0), 0) ?? 0;
    const serviceTotal = data?.details
        ?.filter((d: any) => d.extraServiceId != null)
        .reduce((sum: number, d: any) => sum + (d.price ?? 0), 0) ?? 0;
    const switchRoomFee = data?.roomSwitchHistories
        ?.reduce((sum: number, d: any) => sum + (d.additionalPrice ?? 0), 0) ?? 0;
    const grandTotal =
        RoomTotal + serviceTotal + switchRoomFee;
     return (
    <div
      className="
        border rounded-xl p-6
        bg-white dark:bg-[#111827]
        border-slate-200 dark:border-slate-700
      "
    >
      {/* HEADER */}
      <h3 className="flex items-center gap-2 font-semibold text-[#2E3A8C] dark:text-blue-300 mb-4">
        <FileText size={18} />
        {t("bookingView.billSummary")}
      </h3>

      {/* BODY */}
      <div className="space-y-3 text-sm text-slate-700 dark:text-gray-300">
        <div className="flex justify-between">
          <span>{t("bookingView.roomTotal")}</span>
          <span className="font-mono text-gray-900 dark:text-gray-100">
            {formatMoney(RoomTotal)} VND
          </span>
        </div>

        <div className="flex justify-between">
          <span>{t("bookingView.serviceTotal")}</span>
          <span className="font-mono text-gray-900 dark:text-gray-100">
            {formatMoney(serviceTotal)} VND
          </span>
        </div>

        <div className="flex justify-between">
          <span>{t("bookingView.switchRoomFee")}</span>
          <span className="font-mono text-gray-900 dark:text-gray-100">
            {formatMoney(switchRoomFee)} VND
          </span>
        </div>

        <div className="flex justify-between text-red-500 dark:text-red-400">
          <span>{t("bookingView.discount")}</span>
          <span className="font-mono">-300,000 VND</span>
        </div>

        {/* TOTAL */}
        <div
          className="
            border-t-2 border-dashed
            border-gray-200 dark:border-gray-700
            pt-3 mt-3 flex justify-between items-center
          "
        >
          <span className="font-bold text-lg text-[#2E3A8C] dark:text-blue-300">
            {t("bookingView.grandTotal")}
          </span>

          <span className="font-bold text-xl text-[#2E3A8C] dark:text-blue-300 font-mono">
            {formatMoney(grandTotal)} VND
          </span>
        </div>
      </div>
    </div>
  );
}
export default BillSummaryCard;