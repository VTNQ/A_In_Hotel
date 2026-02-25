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
      className="flex flex-col sm:flex-row
        gap-3
        mt-4
        rounded-2xl
        border border-gray-200
        p-4
        shadow-sm
        bg-white"
    >
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          value={search}
          disabled={disabled}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t("serviceSelection.searchPlaceholder")}
          className="w-full 
          pl-9 pr-3 py-2 
          border border-gray-300 
          rounded-full
          text-sm 
          outline-none
          transition
          focus:ring-2 focus:ring-[#536DB2]   
          disabled:bg-gray-100 disabled:text-gray-400"
        />
      </div>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full sm:w-auto
          px-4 py-2
          border border-gray-300
          rounded-full
          text-sm
          bg-white
          outline-none
          transition
          focus:ring-2 focus:ring-[#536DB2]  
          disabled:bg-gray-100 disabled:text-gray-400
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
