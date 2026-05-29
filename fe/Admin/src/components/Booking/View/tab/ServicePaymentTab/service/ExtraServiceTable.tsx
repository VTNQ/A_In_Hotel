import { Tag } from "lucide-react";
import { useTranslation } from "react-i18next";

const ExtraServiceTable = ({ items }: { items: any[] }) => {
  const { t } = useTranslation();
  const formatMoney = (v: number) =>
    `${v < 0 ? "-" : ""}${Math.abs(v).toLocaleString("vi-VN")}`;
  return (
    <div
      className="
        border rounded-xl overflow-hidden
        border-slate-200 dark:border-slate-700
        bg-white dark:bg-[#111827]
      "
    >
      {/* HEADER */}
      <div
        className="
          flex items-center gap-2 px-6 py-4 font-semibold
          bg-slate-50 dark:bg-slate-800/50
          border-b border-slate-200 dark:border-slate-700
          text-[#2E3A8C] dark:text-blue-300
        "
      >
        <Tag size={18} />
        {t("bookingView.extraServicesDiscounts")}
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead
          className="
            text-slate-500 dark:text-gray-400
            bg-white dark:bg-[#111827]
          "
        >
          <tr>
            <th className="text-left px-6 py-3 font-medium">
              {t("bookingView.service")}
            </th>
            <th className="text-right px-4 py-3 font-medium">
              {t("bookingView.price")}
            </th>
          </tr>
        </thead>

        <tbody>
          {items
            ?.filter((d: any) => d.extraServiceId != null)
            .map((d: any, idx: number) => (
              <tr
                key={idx}
                className="
                  border-t border-slate-200 dark:border-slate-700
                  hover:bg-slate-50 dark:hover:bg-slate-800/40
                  transition
                "
              >
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100">
                  {d.extraServiceName}
                </td>

                <td className="px-6 py-4 text-right font-mono text-gray-600 dark:text-gray-300">
                  {formatMoney(d.price)} VND
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default ExtraServiceTable;
