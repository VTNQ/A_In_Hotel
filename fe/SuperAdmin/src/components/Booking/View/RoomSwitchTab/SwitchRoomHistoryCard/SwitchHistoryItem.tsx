import { useTranslation } from "react-i18next";

const SwitchHistoryItem = ({ data }: any) => {
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const formatDateTime = (value?: string) => {
        if (!value) return "--";

        const locale = i18n.language === "vi" ? "vi-VN" : "en-US";

        return new Date(value).toLocaleString(locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    return (
        <div className={`grid grid-cols-[160px_1fr_2fr_160px] items-center 
                    border border-slate-200 rounded-xl p-4 bg-white border-l-4  ${data?.additionalPrice && data.additionalPrice > 0
                ? "border-l-orange-400"
                : "border-l-slate-300"
            }`}>

            {/* TIME */}
            <div className="text-xs text-slate-500 border border-slate-200 px-2 py-1 rounded w-fit">
                {formatDateTime(data?.switchedAt)}
            </div>

            {/* ROOM SWITCH */}

            <div className="flex items-start gap-4 text-sm pr-6 border-r border-slate-200">
                {/* FROM ROOM */}
                <div className="text-right min-w-[120px]">
                    <div className="font-medium text-slate-400 line-through decoration-red-500">
                        {t("bookingView.fromRoom")} {data?.fromRoomNumber}
                    </div>
                    <div className="text-xs text-slate-400">
                        {data?.fromRoomTypeName}
                    </div>
                </div>

                {/* ARROW */}
                <div className="text-slate-400 mt-1">→</div>

                {/* TO ROOM */}
                <div className="min-w-[140px]">
                    <div className="font-semibold text-[#1D263E]">
                        {t("bookingView.toRoom")} {data?.toRoomNumber}
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                        {data?.toRoomTypeName}
                    </div>
                </div>
            </div>

            {/* REASON */}
            <div className="text-sm px-6 border-r border-slate-200">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                    Reason
                </div>
                <div className="text-slate-700">
                    {data?.reason || ""}
                </div>
            </div>

            {/* PRICE DIFF */}
            <div className="text-center pl-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                    {t("switchRoom.priceImpact")}
                </div>
                {data?.additionalPrice != null && data.additionalPrice > 0 ? (
                    <span
                        className="inline-flex items-center px-3 py-1 rounded-full
                 text-sm font-semibold bg-green-50 text-green-700
                 border border-green-200"
                    >
                        +{data.additionalPrice.toLocaleString("vi-VN")} VND
                    </span>
                ) : (
                    <span
                        className="inline-flex items-center px-3 py-1 rounded-full
                 text-sm font-medium bg-slate-100 text-slate-500
                 border border-slate-200"
                    >
                        {t("switchRoom.noChange")}
                    </span>
                )}

            </div>

        </div>
    );
};

export default SwitchHistoryItem;
