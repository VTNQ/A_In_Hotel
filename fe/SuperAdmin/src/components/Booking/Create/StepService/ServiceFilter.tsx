import { SelectField } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

type Option = { label: string; value: string };

const ServiceFilter = ({
  value,
  onChange,
  categories = [],
  search,
  onSearch,
  disabled,
}: any) => {
  const { t } = useTranslation();

  const options: Option[] = [
    { label: t("serviceSelection.allServices"), value: "all" },
    ...categories.map((c: any) => ({
      label: c.name,
      value: String(c.id),
    })),
  ];

  const handleCategoryChange = (v: string | null) => {
    onChange(v === "all" ? null : v);
  };

  return (
    <div
      className="
        grid grid-cols-[280px_1fr] gap-4 mt-4
        rounded-2xl border p-4
        border-gray-200 bg-white
      "
    >
      {/* SEARCH */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {t("serviceSelection.searchLabel", "Tìm kiếm")}
        </label>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            disabled={disabled}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={t("serviceSelection.searchPlaceholder")}
            className="
              w-full h-10 pl-9 pr-3
              border border-gray-300 rounded-md
              text-sm outline-none transition
              focus:ring-2 focus:ring-indigo-400
              disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
            "
          />
        </div>
      </div>

      {/* CATEGORY */}
      <SelectField<Option>
        label={t("serviceSelection.category", "Danh mục")}
        items={options}
        value={value ?? "all"}
        onChange={(v) => handleCategoryChange(v)}
        placeholder={t("serviceSelection.selectCategory")}
        disabled={disabled}
        isRequired={false}
        getValue={(c) => c.value}
        getLabel={(c) => c.label}
        size="md"
        fullWidth
      />
    </div>
  );
};

export default ServiceFilter;
