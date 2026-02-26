import { Tag } from "lucide-react";
import { useTranslation } from "react-i18next";

const ExtraServiceTable = ({ items }: { items: any[] }) => {
  const { t } = useTranslation();
  const formatMoney = (v: number) =>
    `${v < 0 ? "-" : ""}${Math.abs(v).toLocaleString("vi-VN")}`;
  return (
    <div className="border rounded-xl border-slate-200 overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 bg-slate-50 border-b border-slate-200 font-semibold text-[#2E3A8C]">
        <Tag size={18} />
        {t("bookingView.extraServicesDiscounts")}
      </div>
      <table className="w-full text-sm">
        <thead className="text-slate-500">
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
            .map((d: any) => (
              <tr className="border-t border-slate-200 hover:bg-slate-50 transition">
                <td
                  className={`px-6 py-4 font-bold text-gray-900 dark:text-white `}
                >
                  {d.extraServiceName}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-right font-mono">
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
