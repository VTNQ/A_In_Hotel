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
    <div className="flex items-center gap-2">
      <SelectField
        items={[
          { value: "ALL", label: t("hotel.hotelFilter.all") },
          { value: "1", label: t("hotel.hotelFilter.active") },
          { value: "0", label: t("hotel.hotelFilter.inactive") },
        ]}
        value={statusFilter === "ALL" ? "ALL" : String(statusFilter)}
        onChange={(v) =>
          onStatusFilterChange(
            v === "ALL" ? "ALL" : (Number(v) as Status)
          )
        }
        size="sm"
        fullWidth={false}
        getValue={(i) => i.value}
        getLabel={(i) => i.label}
      />
      <div className="relative w-72">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2" />
        <Input
          className="pl-9"
          value={search}
          placeholder={t("hotel.hotelFilter.searchPlaceholder")}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button asChild>
        <a href="/Home/hotel/create">{t("hotel.hotelFilter.create")}</a>
      </Button>
    </div>
  )
}
export default HotelFilter;