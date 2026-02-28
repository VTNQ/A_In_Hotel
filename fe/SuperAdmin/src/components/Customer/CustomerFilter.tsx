import type { CustomerFilterProps } from "@/type/customer.types";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";

const CustomerFilter = ({ search, onSearchChange }: CustomerFilterProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end gap-4 w-full">
      <div className="relative w-full sm:max-w-sm md:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("customer.search.placeholder")}
          className="
            pl-9
            h-10
            rounded-lg
            border-gray-300
            focus:border-[#2E3A8C]
            focus:ring-[#2E3A8C]
          "
        />
      </div>
    </div>
  );
};

export default CustomerFilter;
