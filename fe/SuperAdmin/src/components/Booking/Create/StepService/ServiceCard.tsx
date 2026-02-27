import { File_URL } from "@/setting/constant/app";
import { estimateServicePrice } from "@/util/estimateServicePrice";
import { useTranslation } from "react-i18next";

const ServiceCard = ({ service, selected, onToggle, booking }: any) => {
  const estimate = estimateServicePrice(service, booking);
  const { t } = useTranslation();

  return (
    <div
      className={`
        flex flex-col sm:flex-row gap-4 rounded-2xl border p-4 transition
        ${
          selected
            ? "border-indigo-300 bg-indigo-50"
            : "border-gray-200 bg-white hover:border-indigo-200"
        }
      `}
    >
      {/* ICON / IMAGE */}
      <img
        src={File_URL + service.icon?.url}
        alt={service.serviceName}
        className="w-full h-40 sm:w-24 sm:h-24 rounded-xl object-cover bg-gray-100"
      />

      {/* CONTENT */}
      <div className="flex-1 flex flex-col justify-between">
        {/* TOP */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4">
          <div className="min-w-0">
            <h3 className="font-medium text-gray-900 text-base sm:text-sm truncate">
              {service.serviceName}
            </h3>

            {service.description && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                {service.description}
              </p>
            )}
          </div>

          {/* PRICE */}
          <div className="sm:text-right shrink-0">
          <div className="text-lg sm:text-base font-semibold text-indigo-500">
            ${service.price}
          </div>
          <div className="text-xs text-gray-400">
            / {t(`serviceSelection.unit.${service.unit}`)}
          </div>
        </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4">
          <span className="text-sm text-gray-500">
          {t("serviceSelection.estimated")}:
          <span className="ml-1 font-medium text-gray-700">
            ${estimate}
          </span>
        </span>

        <button
          onClick={onToggle}
          className={`
            w-full sm:w-auto
            px-4 py-2 sm:py-1.5 
            rounded-full text-sm font-medium transition
            ${
              selected
                ? "bg-indigo-500 text-white hover:bg-indigo-600"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
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
  );
};

export default ServiceCard;
