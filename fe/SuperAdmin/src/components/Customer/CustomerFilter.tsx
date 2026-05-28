import type { CustomerFilterProps } from "@/type/customer.types";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";

const CustomerFilter = ({ search, onSearchChange }: CustomerFilterProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end gap-4 w-full">
      <div className="relative w-full sm:max-w-sm md:max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400
        dark:text-neutral-500"
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("customer.search.placeholder")}
          className="
            h-10 pl-9 rounded-lg
            border-gray-300
            bg-white
            text-gray-800
            placeholder:text-gray-400
            focus:border-[#2E3A8C]
            focus:ring-[#2E3A8C]
            dark:border-neutral-700
            dark:bg-neutral-900
            dark:text-white
            dark:placeholder:text-neutral-500
            dark:focus:border-indigo-500
            dark:focus:ring-indigo-500
          "
        />
      </div>
    </div>
  );
};

export default CustomerFilter;
