import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

const BillSummaryCard = ({ data }: any) => {
  const { t } = useTranslation();

  const formatMoney = (v: number) =>
    `${v < 0 ? "-" : ""}${Math.abs(v).toLocaleString("vi-VN")}`;

  const roomTotal =
    data?.details
      ?.filter((d: any) => d.roomId != null)
      .reduce((sum: number, d: any) => sum + (d.price ?? 0), 0) ?? 0;

  const serviceTotal =
    data?.details
      ?.filter((d: any) => d.extraServiceId != null)
      .reduce((sum: number, d: any) => sum + (d.price ?? 0), 0) ?? 0;

  const switchRoomFee =
    data?.roomSwitchHistories
      ?.reduce((sum: number, d: any) => sum + (d.additionalPrice ?? 0), 0) ?? 0;

  const discount = data?.discount ?? 0;

  const grandTotal =
    roomTotal + serviceTotal + switchRoomFee - discount;

  return (
    <div className="border rounded-2xl border-slate-200 bg-white overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center gap-2 px-6 py-4 bg-indigo-50 border-b border-slate-200">
        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
          <FileText size={16} />
        </div>
        <h3 className="font-semibold text-slate-800">
          {t("bookingView.billSummary")}
        </h3>
      </div>

      {/* CONTENT */}
      <div className="px-6 py-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">
            {t("bookingView.roomTotal")}
          </span>
          <span className="font-mono font-medium text-slate-800">
            {formatMoney(roomTotal)} VND
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-600">
            {t("bookingView.serviceTotal")}
          </span>
          <span className="font-mono font-medium text-slate-800">
            {formatMoney(serviceTotal)} VND
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-600">
            {t("bookingView.switchRoomFee")}
          </span>
          <span className="font-mono font-medium text-slate-800">
            {formatMoney(switchRoomFee)} VND
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-slate-600">
              {t("bookingView.discount")}
            </span>
            <span className="font-mono font-medium text-rose-600">
              -{formatMoney(discount)} VND
            </span>
          </div>
        )}

        {/* TOTAL */}
        <div className="pt-4 mt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
          <span className="text-base font-semibold text-slate-800">
            {t("bookingView.grandTotal")}
          </span>
          <span className="text-xl font-bold text-indigo-600 font-mono">
            {formatMoney(grandTotal)}{" "}
            <span className="text-sm font-medium text-slate-400">
              VND
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default BillSummaryCard;
