import { Tag } from "lucide-react";
import { useTranslation } from "react-i18next";

const ExtraServiceTable = ({ items }: { items: any[] }) => {
  const { t } = useTranslation();

  const formatMoney = (v: number) =>
    `${v < 0 ? "-" : ""}${Math.abs(v).toLocaleString("vi-VN")}`;

  return (
    <div className="border rounded-2xl border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 bg-indigo-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800">
        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
          <Tag size={16} />
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-neutral-100">
          {t("bookingView.extraServicesDiscounts")}
        </h3>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-neutral-950 text-slate-500 dark:text-neutral-400">
          <tr>
            <th className="text-left px-6 py-3 font-medium">
              {t("bookingView.service")}
            </th>
            <th className="text-right px-6 py-3 font-medium">
              {t("bookingView.price")}
            </th>
          </tr>
        </thead>

        <tbody>
          {items
            ?.filter((d: any) => d.extraServiceId != null)
            .map((d: any, index: number) => (
              <tr
                key={d.extraServiceId ?? index}
                className="border-t border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
              >
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-neutral-100">
                  {d.extraServiceName}
                </td>

                <td className="px-6 py-4 text-right font-mono font-semibold text-slate-700 dark:text-neutral-300">
                  {formatMoney(d.price)}{" "}
                  <span className="text-xs text-slate-400 dark:text-neutral-500">VND</span>
                </td>
              </tr>
            ))}

          {(!items || items.length === 0) && (
            <tr>
              <td
                colSpan={2}
                className="px-6 py-8 text-center text-slate-500 dark:text-neutral-400 italic"
              >
                {t("bookingView.noExtraServices")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExtraServiceTable;
