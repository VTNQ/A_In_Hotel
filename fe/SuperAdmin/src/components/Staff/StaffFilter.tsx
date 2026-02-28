import { getAllHotel } from "@/service/api/Hotel";
import type { HotelRow } from "@/type/hotel.types";
import type { StaffFilterProps } from "@/type/Staff.type";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SelectField } from "../ui/select";
import type { Status } from "@/type/common";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const StaffFilter = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  hotelFilter,
  onHotelFilterChange,
}: StaffFilterProps) => {
  const { t } = useTranslation();
  const [hotels, setHotels] = useState<HotelRow[]>([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const param = { all: true, filter: "status==1" };
        const response = await getAllHotel(param);
        setHotels(response?.data?.content || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHotels();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row lg:items-end gap-3 w-full">
      {/* LEFT FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        {/* STATUS */}
        <div className="w-full sm:w-48">
          <SelectField
            isRequired={false}
            placeholder={t("staff.selectStatus")}
            items={[
              { value: "ALL", label: t("common.all") },
              { value: "1", label: t("common.active") },
              { value: "0", label: t("common.deActivate") },
            ]}
            value={statusFilter === "ALL" ? "ALL" : String(statusFilter)}
            onChange={(v) =>
              onStatusFilterChange(
                v === "ALL" ? "ALL" : (Number(v) as Status),
              )
            }
            size="sm"
            fullWidth={true}
            getValue={(i) => i.value}
            getLabel={(i) => i.label}
          />
        </div>

        {/* HOTEL */}
        <div className="w-full sm:w-56">
          <SelectField
            isRequired={false}
            placeholder={t("staff.selectHotel")}
            items={hotels}
            value={hotelFilter}
            onChange={(v) => onHotelFilterChange(String(v))}
            size="sm"
            fullWidth={true}
            getValue={(i) => String(i.id)}
            getLabel={(i) => i.name}
          />
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:ml-auto">
        {/* SEARCH */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            className="pl-9"
            value={search}
            placeholder={t("staff.searchPlaceholder")}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <Button asChild className="w-full sm:w-auto">
          <a href="/Home/staff/create">{t("staff.new")}</a>
        </Button>
      </div>
    </div>
  );
};

export default StaffFilter;