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
    <div
      className={`
        grid grid-cols-[160px_1fr_2fr_160px] items-center
        border rounded-xl p-4 bg-white dark:bg-[#111827]
        border-slate-200 dark:border-slate-700
        ${
          data?.additionalPrice && data.additionalPrice > 0
            ? "border-l-4 border-l-orange-400 dark:border-l-orange-500"
            : "border-l-4 border-l-slate-300 dark:border-l-slate-600"
        }
      `}
    >
      {/* TIME */}
      <div
        className="
        text-xs px-2 py-1 rounded w-fit
        text-slate-500 dark:text-gray-400
        border border-slate-200 dark:border-slate-700
        bg-white dark:bg-slate-800/50
      "
      >
        {formatDateTime(data?.switchedAt)}
      </div>

      {/* ROOM SWITCH */}
      <div
        className="
        flex items-start gap-4 text-sm pr-6
        border-r border-slate-200 dark:border-slate-700
      "
      >
        {/* FROM */}
        <div className="text-right min-w-[120px]">
          <div
            className="
            font-medium line-through decoration-red-500
            text-slate-400 dark:text-gray-500
          "
          >
            {t("bookingView.fromRoom")} {data?.fromRoomName}
          </div>

          <div className="text-xs text-slate-400 dark:text-gray-500">
            {data?.fromRoomTypeName}
          </div>
        </div>

        {/* ARROW */}
        <div className="text-slate-400 dark:text-gray-500 mt-1">→</div>

        {/* TO */}
        <div className="min-w-[140px]">
          <div className="font-semibold text-[#1D263E] dark:text-gray-100">
            {t("bookingView.toRoom")} {data?.toRoomName}
          </div>

          <div className="text-xs font-medium text-green-600 dark:text-green-400">
            {data?.toRoomTypeName}
          </div>
        </div>
      </div>

      {/* REASON */}
      <div
        className="
        text-sm px-6 border-r border-slate-200 dark:border-slate-700
      "
      >
        <div
          className="
          text-xs font-semibold uppercase tracking-wide mb-1
          text-slate-400 dark:text-gray-400
        "
        >
          Reason
        </div>

        <div className="text-slate-700 dark:text-gray-200">
          {data?.reason || ""}
        </div>
      </div>

      {/* PRICE DIFF */}
      <div className="text-center pl-6">
        <div
          className="
          text-xs font-semibold uppercase tracking-wide mb-1
          text-slate-400 dark:text-gray-400
        "
        >
          {t("switchRoom.priceImpact")}
        </div>

        {data?.additionalPrice != null && data.additionalPrice > 0 ? (
          <span
            className="
              inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold
              bg-green-50 text-green-700 border border-green-200
              dark:bg-green-900/30 dark:text-green-300 dark:border-green-800
            "
          >
            +{data.additionalPrice.toLocaleString("vi-VN")} VND
          </span>
        ) : (
          <span
            className="
              inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              bg-slate-100 text-slate-500 border border-slate-200
              dark:bg-slate-800 dark:text-gray-400 dark:border-slate-700
            "
          >
            {t("switchRoom.noChange")}
          </span>
        )}
      </div>
    </div>
  );
};

export default SwitchHistoryItem;
