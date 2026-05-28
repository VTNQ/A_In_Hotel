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
                    border border-slate-200 dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900 border-l-4  ${data?.additionalPrice && data.additionalPrice > 0
                ? "border-l-orange-400"
                : "border-l-slate-300 dark:border-l-neutral-700"
            }`}>

            {/* TIME */}
            <div className="text-xs text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800 px-2 py-1 rounded w-fit bg-slate-50 dark:bg-neutral-950">
                {formatDateTime(data?.switchedAt)}
            </div>

            {/* ROOM SWITCH */}

            <div className="flex items-start gap-4 text-sm pr-6 border-r border-slate-200 dark:border-neutral-800">
                {/* FROM ROOM */}
                <div className="text-right min-w-[120px]">
                    <div className="font-medium text-slate-400 dark:text-neutral-500 line-through decoration-red-500">
                        {t("bookingView.fromRoom")} {data?.fromRoomNumber}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-neutral-500">
                        {data?.fromRoomTypeName}
                    </div>
                </div>

                {/* ARROW */}
                <div className="text-slate-400 dark:text-neutral-500 mt-1">→</div>

                {/* TO ROOM */}
                <div className="min-w-[140px]">
                    <div className="font-semibold text-[#1D263E] dark:text-neutral-200">
                        {t("bookingView.toRoom")} {data?.toRoomNumber}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                        {data?.toRoomTypeName}
                    </div>
                </div>
            </div>

            {/* REASON */}
            <div className="text-sm px-6 border-r border-slate-200 dark:border-neutral-800">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-neutral-500 mb-1">
                    Reason
                </div>
                <div className="text-slate-700 dark:text-neutral-300">
                    {data?.reason || ""}
                </div>
            </div>

            {/* PRICE DIFF */}
            <div className="text-center pl-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-neutral-500 mb-1">
                    {t("switchRoom.priceImpact")}
                </div>
                {data?.additionalPrice != null && data.additionalPrice > 0 ? (
                    <span
                        className="inline-flex items-center px-3 py-1 rounded-full
                  text-sm font-semibold bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400
                  border border-green-200 dark:border-green-900/50"
                    >
                        +{data.additionalPrice.toLocaleString("vi-VN")} VND
                    </span>
                ) : (
                    <span
                        className="inline-flex items-center px-3 py-1 rounded-full
                  text-sm font-medium bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400
                  border border-slate-200 dark:border-neutral-700"
                    >
                        {t("switchRoom.noChange")}
                    </span>
                )}

            </div>

        </div>
    );
};

export default SwitchHistoryItem;
