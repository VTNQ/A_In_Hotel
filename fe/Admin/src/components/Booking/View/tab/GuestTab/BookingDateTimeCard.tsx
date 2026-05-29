import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

const BookingDateTimeCard = ({ data }: any) => {
  const { t } = useTranslation();

  const BOOKING_PACKAGE_MAP: Record<number, { label: string; color: string }> = {
    1: {
      label: t("bookingDateTime.packageDayUse"),
      color:
        "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    },
    2: {
      label: t("bookingDateTime.packageOvernight"),
      color:
        "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    },
    3: {
      label: t("bookingDateTime.packageFullDay"),
      color:
        "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
    },
  };

  const formatDateTime = (value?: string) => {
    if (!value) return "--";
    return new Date(value).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="
      border rounded-xl p-5
      border-slate-200 dark:border-slate-700
      bg-white dark:bg-[#111827]
    ">
      {/* HEADER */}
      <h3 className="
        flex items-center gap-2 text-base font-semibold mb-6 pb-3
        border-b border-slate-200 dark:border-slate-700
        text-[#1D263E] dark:text-gray-100
      ">
        <Calendar size={18} />
        {t("bookingDateTime.title")}
      </h3>

      {/* BOOKING TYPE */}
      <div className="text-sm mb-6">
        <div className="
          text-xs font-medium tracking-wide uppercase
          text-slate-400 dark:text-gray-400
        ">
          {t("bookingDateTime.package")}
        </div>

        {BOOKING_PACKAGE_MAP[data?.bookingPackage] && (
          <span
            className={`inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-semibold border ${BOOKING_PACKAGE_MAP[data.bookingPackage].color}`}
          >
            {BOOKING_PACKAGE_MAP[data.bookingPackage].label}
          </span>
        )}
      </div>

      {/* TIMELINE */}
      <div className="relative pl-6 space-y-6 text-sm">

        {/* LINE */}
        <div className="
          absolute left-[6px] top-1 bottom-1 w-px
          bg-slate-200 dark:bg-slate-700
        " />

        {/* CHECK IN */}
        <div className="relative flex gap-4">
          <div
            className={`w-3 h-3 rounded-full mt-1.5 z-10 ${
              data?.checkedInAt
                ? "bg-emerald-500"
                : "bg-slate-300 dark:bg-slate-600"
            }`}
          />

          <div className="flex-1">
            <div className="
              text-xs font-semibold uppercase tracking-wide
              text-slate-400 dark:text-gray-400
            ">
              {t("bookingDateTime.checkInDate")}
            </div>

            <div className="flex items-center justify-between mt-1">

              {data?.checkedInAt ? (
                <>
                  <span className="
                    font-medium text-slate-800 dark:text-gray-100
                  ">
                    {formatDateTime(data.checkedInAt)}
                  </span>

                  <span className="
                    text-green-700 bg-green-100
                    dark:bg-green-900/30 dark:text-green-300
                    px-2 py-0.5 rounded text-xs font-medium
                  ">
                    {t("bookingView.actual")}: {formatDateTime(data?.checkedInAt)}
                  </span>
                </>
              ) : (
                <span className="italic text-slate-400 dark:text-gray-500">
                  {t("bookingView.pending")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CHECK OUT */}
        <div className="relative flex gap-4">

          <div
            className={`w-3 h-3 rounded-full mt-1.5 z-10 ${
              data?.checkedOutAt
                ? "bg-amber-500"
                : data?.checkedInAt
                ? "bg-slate-400 dark:bg-slate-500"
                : "bg-slate-200 dark:bg-slate-700"
            }`}
          />

          <div className="flex-1">
            <div className="
              text-xs font-semibold uppercase tracking-wide
              text-slate-400 dark:text-gray-400
            ">
              {t("bookingDateTime.checkOutDate")}
            </div>

            <div className="flex items-center justify-between mt-1">

              {data?.checkedOutAt ? (
                <>
                  <span className="
                    font-medium text-slate-800 dark:text-gray-100
                  ">
                    {formatDateTime(data.checkedOutAt)}
                  </span>

                  <span className="
                    text-green-700 bg-green-100
                    dark:bg-green-900/30 dark:text-green-300
                    px-2 py-0.5 rounded text-xs font-medium
                  ">
                    {t("bookingView.actual")}: {formatDateTime(data?.checkedOutAt)}
                  </span>
                </>
              ) : data?.checkedInAt ? (
                <span className="italic text-slate-500 dark:text-gray-400">
                  {t("bookingView.pending")}
                </span>
              ) : (
                <span className="italic text-slate-300 dark:text-gray-600">
                  {t("bookingView.awaitCheckIn")}
                </span>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDateTimeCard;