import { useTranslation } from "react-i18next";
import { File_URL } from "../../../../setting/constant/app";
import { estimateServicePrice } from "../../../../util/estimateServicePrice";

const ServiceCard = ({ service, selected, onToggle, booking }: any) => {
  const estimate = estimateServicePrice(service, booking);
  const { t } = useTranslation();

  return (
    <div
      className={`
        rounded-2xl border p-4 transition
        bg-white dark:bg-gray-900
        ${selected
          ? "border-[#536DB2] bg-blue-50 dark:bg-blue-950/30"
          : "border-gray-200 dark:border-gray-700"}
      `}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <img
          src={File_URL + service.icon?.url}
          className="w-full sm:w-24 h-40 sm:h-20 rounded-xl object-cover"
        />

        <div className="flex-1 flex flex-col">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-medium text-base truncate text-gray-900 dark:text-gray-100">
                {service.serviceName}
              </h3>

              <p className="text-sm mt-1 line-clamp-2 text-gray-500 dark:text-gray-400">
                {service.description}
              </p>
            </div>

            {/* EXCHANGE DISPLAY */}
            <div className="sm:text-right">
              <div className="text-[#536DB2] font-semibold text-lg sm:text-base">
                {service.extraCharge}%
                <span className="text-xs ml-1 text-gray-400 dark:text-gray-500">
                  {t("serviceSelection.ofBooking")}
                </span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("serviceSelection.estimated")}: ${estimate.toFixed(2)}
            </span>

            <button
              onClick={onToggle}
              className={`
                w-full sm:w-auto px-5 py-2 rounded-xl text-sm font-medium transition
                ${
                  selected
                    ? "bg-[#42578E] text-white"
                    : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                }
              `}
            >
              {selected
                ? t("serviceSelection.added")
                : t("serviceSelection.add")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;