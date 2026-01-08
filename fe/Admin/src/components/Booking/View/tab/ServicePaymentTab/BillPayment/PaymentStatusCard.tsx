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
        <div className="border border-slate-200 rounded-xl p-6">
            <h3 className="flex items-center gap-2 font-semibold mb-4 text-[#2E3A8C]">
                <DollarSign size={18} />
                 {t("bookingView.paymentStatus")}
            </h3>

            <div className="space-y-4">
                <div className="flex justify-between items-center rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <span className="text-emerald-800 font-semibold text-sm">{t("bookingView.paidAmount")}</span>
                    <span className="font-bold text-emerald-700 font-mono">
                         {formatMoney(paidAmount)} VND
                    </span>
                </div>
                <div className="flex justify-between items-center rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <span className="text-red-800 font-semibold text-sm">{t("bookingView.remainingAmount")}</span>
                    <span className="font-bold text-red-600 font-mono text-lg">{formatMoney(outstanding)} VND</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Info size={14} />
                     {t("bookingView.lastMethod")}: <strong>{lastMethod}</strong>
                </div>
            </div>
        </div>
    )
}
export default PaymentStatusCard;