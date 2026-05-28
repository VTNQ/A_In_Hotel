import { DollarSign, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

const PaymentStatusCard = ({ data }: any) => {
  const { t } = useTranslation();

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

  const grandTotal = roomTotal + serviceTotal + switchRoomFee;

  const payments = data?.payment ?? [];
  const paidAmount = payments.reduce(
    (sum: number, p: any) => sum + (p.paidAmount ?? 0),
    0
  );

  const outstanding = Math.max(grandTotal - paidAmount, 0);
  const lastPayment = payments[payments.length - 1];
  const lastMethod = lastPayment?.paymentMethod ?? "--";

  const formatMoney = (v: number) =>
    `${v < 0 ? "-" : ""}${Math.abs(v).toLocaleString("vi-VN")}`;

  return (
    <div className="border rounded-2xl border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
      {/* HEADER */}
      <h3 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-neutral-100 mb-5">
        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
          <DollarSign size={16} />
        </div>
        {t("bookingView.paymentStatus")}
      </h3>

      {/* PAID */}
      <div className="space-y-4">
        <div className="flex justify-between items-center rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 px-4 py-3">
          <span className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
            {t("bookingView.paidAmount")}
          </span>
          <span className="font-bold text-emerald-700 dark:text-emerald-300 font-mono">
            {formatMoney(paidAmount)}{" "}
            <span className="text-xs font-medium text-emerald-500 dark:text-emerald-400">VND</span>
          </span>
        </div>

        {/* OUTSTANDING */}
        <div className="flex justify-between items-center rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 px-4 py-3">
          <span className="text-sm font-medium text-rose-800 dark:text-rose-400">
            {t("bookingView.remainingAmount")}
          </span>
          <span className="font-bold text-rose-600 dark:text-rose-300 font-mono text-lg">
            {formatMoney(outstanding)}{" "}
            <span className="text-xs font-medium text-rose-500 dark:text-rose-400">VND</span>
          </span>
        </div>

        {/* LAST PAYMENT METHOD */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-neutral-400 pt-1">
          <Info size={14} />
          <span>
            {t("bookingView.lastMethod")}:{" "}
            <strong className="text-slate-700 dark:text-neutral-200">{lastMethod}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusCard;
