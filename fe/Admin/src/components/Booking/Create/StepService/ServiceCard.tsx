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
        <div className={`flex gap-4 rounded-xl border p-4 bg-white
            ${selected ? "border-[#536DB2] bg-blue-50" : "border-gray-200"}`}>
            <img
                src={File_URL + service.icon?.url}
                className="w-24 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
                <div className="flex justify-between">
                    <div>
                        <h3 className="font-medium text-gray-900">
                            {service.serviceName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {service.description}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-[#536DB2] font-semibold">
                            ${service.price}
                            <span className="text-xs text-gray-400">
                                {" "}
                                /  {t(`serviceSelection.unit.${service.unit}`)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-400">
                        {t("serviceSelection.estimated")}: ${estimate}
                    </span>

                    <button
                        onClick={onToggle}
                        className={`px-4 py-1.5 rounded-full text-sm ${selected
                            ? "bg-[#42578E] text-white"
                            : "border border-gray-300 text-gray-700"
                            }`}
                    >
                        {selected
                            ? t("serviceSelection.added")
                            : t("serviceSelection.add")}
                    </button>
                </div>
            </div>
        </div>
    )
}
export default ServiceCard;