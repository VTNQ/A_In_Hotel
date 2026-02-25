import { useTranslation } from "react-i18next";
import { File_URL } from "../../../../setting/constant/app";
import { estimateServicePrice } from "../../../../util/estimateServicePrice";
// const unitText: Record<string, string> = {
//     PERNIGHT: "guest",
//     PERDAY: "guest",
//     PERUSE: "flat fee",
//     PERTRIP: "trip",
// };
const ServiceCard = ({ service, selected, onToggle, booking }: any) => {
  const estimate = estimateServicePrice(service, booking);
  const { t } = useTranslation();
  return (
    <div
      className={`rounded-2xl   border p-4 bg-white transition
            ${selected ? "border-[#536DB2] bg-blue-50" : "border-gray-200"}`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <img
          src={File_URL + service.icon?.url}
          className="w-full sm:w-24 h-40 sm:h-20 rounded-xl object-cover"
        />
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-medium text-gray-900 text-base truncate">
                {service.serviceName}
              </h3>

              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {service.description}
              </p>
            </div>
            <div className="sm:text-right">
              <div className="text-[#536DB2] font-semibold text-lg sm:text-base">
                ${service.price}
                <span className="text-xs text-gray-400 ml-1">
                  / {t(`serviceSelection.unit.${service.unit}`)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4">
            <span className="text-sm text-gray-400">
              {t("serviceSelection.estimated")}: ${estimate}
            </span>

            <button
              onClick={onToggle}
              className={`
              w-full sm:w-auto
              px-5 py-2
              rounded-xl
              text-sm font-medium
              transition
              ${
                selected
                  ? "bg-[#42578E] text-white"
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
    </div>
  );
};
export default ServiceCard;
