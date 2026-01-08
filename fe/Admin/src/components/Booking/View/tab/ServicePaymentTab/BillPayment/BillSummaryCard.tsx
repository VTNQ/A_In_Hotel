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
        <div className="border border-slate-200 rounded-xl  bg-white p-6">
            <h3 className="flex items-center gap-2 font-semibold text-[#2E3A8C] mb-4">
                <FileText size={18} />
                 {t("bookingView.billSummary")}
            </h3>
            <div className="space-y-3 text-sm text-slate-700">
                <div className="flex justify-between">
                    <span>{t("bookingView.roomTotal")}</span>
                    <span className="font-mono">{formatMoney(RoomTotal)} VND</span>
                </div>
                <div className="flex justify-between">
                    <span>{t("bookingView.serviceTotal")}</span>
                    <span className="font-mono">{formatMoney(serviceTotal)} VND</span>
                </div>
                <div className="flex justify-between">
                    <span>{t("bookingView.switchRoomFee")}</span>
                    <span className="font-mono">{formatMoney(switchRoomFee)} VND</span>
                </div>
                <div className="flex justify-between text-red-600">
                    <span>{t("bookingView.discount")}</span>
                    <span className="font-mono">-300,000 VND</span>
                </div>

                <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-700 pt-3 mt-3 flex justify-between items-center">
                    <span className="font-bold text-lg text-primary text-[#2E3A8C]">{t("bookingView.grandTotal")}</span>
                    <span className="font-bold text-xl text-[#2E3A8C] font-mono">{formatMoney(grandTotal)} VND</span>
                </div>
            </div>
        </div>
    )
}
export default BillSummaryCard;