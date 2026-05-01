import type { HotelFilterProps } from "@/type/hotel.types";
import { SelectField } from "../ui/select";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { Status } from "@/type/common";
import { useTranslation } from "react-i18next";

const HotelFilter = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: HotelFilterProps) => {
  const { t } = useTranslation();
   return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center lg:justify-end">
        {/* STATUS */}
        <div className="w-full sm:col-span-1 lg:w-[180px]">
          <SelectField
            isRequired={false}
            items={[
              { value: "ALL", label: t("hotel.hotelFilter.all") },
              { value: "1", label: t("hotel.hotelFilter.active") },
              { value: "0", label: t("hotel.hotelFilter.inactive") },
            ]}
            value={statusFilter === "ALL" ? "ALL" : String(statusFilter)}
            onChange={(v) =>
              onStatusFilterChange(v === "ALL" ? "ALL" : (Number(v) as Status))
            }
            size="sm"
            fullWidth
            getValue={(i) => i.value}
            getLabel={(i) => i.label}
          />
        </div>

        {/* SEARCH */}
        <div className="relative w-full sm:col-span-1 lg:w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            className="pl-9 w-full"
            value={search}
            placeholder={t("hotel.hotelFilter.searchPlaceholder")}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <div className="sm:col-span-2 lg:col-span-1 lg:ml-2">
          <Button asChild className="w-full sm:w-auto whitespace-nowrap">
            <a href="/Home/hotel/create">{t("hotel.hotelFilter.create")}</a>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default HotelFilter;
