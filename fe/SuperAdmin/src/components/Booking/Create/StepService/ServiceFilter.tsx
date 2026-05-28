import { SelectField } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

type Option = {
  label: string;
  value: string;
};

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
    {
      label: t("serviceSelection.allServices"),
      value: "all",
    },
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
        mt-4 grid grid-cols-1 gap-4 rounded-2xl border p-4
        border-gray-200 bg-white
        dark:border-neutral-800 dark:bg-neutral-900
        sm:grid-cols-[280px_1fr]
      "
    >
      {/* SEARCH */}
      <div>
        <label
          className="
            mb-1.5 block text-sm font-medium
            text-gray-700
            dark:text-neutral-300
          "
        >
          {t("serviceSelection.searchLabel", "Tìm kiếm")}
        </label>

        <div className="relative">
          <Search
            className="
              absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2
              text-gray-400
              dark:text-neutral-500
            "
          />

          <input
            value={search}
            disabled={disabled}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={t("serviceSelection.searchPlaceholder")}
            className="
              h-10 w-full rounded-md border pl-9 pr-3 text-sm outline-none transition
              border-gray-300 bg-white text-gray-900
              focus:ring-2 focus:ring-indigo-400

              dark:border-neutral-700
              dark:bg-neutral-800
              dark:text-white
              dark:placeholder:text-neutral-500
              dark:focus:ring-indigo-500

              disabled:cursor-not-allowed
              disabled:bg-gray-100
              disabled:text-gray-400

              dark:disabled:bg-neutral-950
              dark:disabled:text-neutral-600
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