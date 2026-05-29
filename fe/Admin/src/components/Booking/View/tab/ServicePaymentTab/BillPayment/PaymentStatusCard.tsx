import { DollarSign, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

const PaymentStatusCard = ({ data }: any) => {
    const { t } = useTranslation();
    const RoomTotal = data?.details
        ?.filter((d: any) => d.roomId != null)
        .reduce((sum: number, d: any) => sum + (d.price ?? 0), 0) ?? 0;
    const payments = data?.payment ?? [];
    const serviceTotal = data?.details
        ?.filter((d: any) => d.extraServiceId != null)
        .reduce((sum: number, d: any) => sum + (d.price ?? 0), 0) ?? 0;
    const switchRoomFee = data?.roomSwitchHistories
        ?.reduce((sum: number, d: any) => sum + (d.additionalPrice ?? 0), 0) ?? 0;
    const grandTotal =
        RoomTotal + serviceTotal + switchRoomFee;
    const paidAmount = payments.reduce(
        (sum: number, p: any) => sum + (p.paidAmount ?? 0),
        0
    );
    const outstanding = Math.max(grandTotal - paidAmount, 0);
    const lastPayment = payments[payments.length - 1];
    const lastMethod = lastPayment?.paymentMethod ?? "—";
    const formatMoney = (v: number) =>
        `${v < 0 ? "-" : ""}${Math.abs(v).toLocaleString("vi-VN")}`;
    return (
  <div
    className="
      border rounded-xl p-6
      border-slate-200 dark:border-slate-700
      bg-white dark:bg-[#111827]
    "
  >
    {/* HEADER */}
    <h3 className="flex items-center gap-2 font-semibold mb-4 text-[#2E3A8C] dark:text-blue-300">
      <DollarSign size={18} />
      {t("bookingView.paymentStatus")}
    </h3>

    <div className="space-y-4">
      {/* PAID */}
      <div
        className="
          flex justify-between items-center rounded-lg px-4 py-3
          border border-emerald-200 dark:border-emerald-900/40
          bg-emerald-50 dark:bg-emerald-900/20
        "
      >
        <span className="text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
          {t("bookingView.paidAmount")}
        </span>

        <span className="font-bold text-emerald-700 dark:text-emerald-300 font-mono">
          {formatMoney(paidAmount)} VND
        </span>
      </div>

      {/* OUTSTANDING */}
      <div
        className="
          flex justify-between items-center rounded-lg px-4 py-3
          border border-red-200 dark:border-red-900/40
          bg-red-50 dark:bg-red-900/20
        "
      >
        <span className="text-red-800 dark:text-red-300 font-semibold text-sm">
          {t("bookingView.remainingAmount")}
        </span>

        <span className="font-bold text-red-600 dark:text-red-300 font-mono text-lg">
          {formatMoney(outstanding)} VND
        </span>
      </div>

      {/* LAST METHOD */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
        <Info size={14} />
        {t("bookingView.lastMethod")}:{" "}
        <strong className="text-slate-700 dark:text-gray-200">
          {lastMethod}
        </strong>
      </div>
    </div>
  </div>
);
}
export default PaymentStatusCard;