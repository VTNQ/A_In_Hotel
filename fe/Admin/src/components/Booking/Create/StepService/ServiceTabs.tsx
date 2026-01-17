import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const ServiceTabs = ({
  value,
  onChange,
  categories,
  search,
  onSearch,
  disabled,
}: any) => {
  const { t } = useTranslation();
  const options = [
    { label: t("serviceSelection.allServices"), value: "" },
    ...(categories || []).map((c: any) => ({
      label: c.name,
      value: String(c.id),
    })),
  ];

  return (
    <div
      className="flex items-center gap-3 mt-4 rounded-2xl border p-4 shadow-sm
      border-gray-200"
    >
      <div className="relative w-[280px]">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          value={search}
          disabled={disabled}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t("serviceSelection.searchPlaceholder")}
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-full
                     text-sm focus:ring-2 focus:ring-[#536DB2] outline-none  disabled:bg-gray-100 disabled:text-gray-400"
        />
      </div>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="
          px-4 py-2
          border border-gray-300
          rounded-full
          text-sm
          bg-white
          outline-none
          focus:ring-2 focus:ring-[#536DB2]  disabled:bg-gray-100 disabled:text-gray-400
        "
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ServiceTabs;
