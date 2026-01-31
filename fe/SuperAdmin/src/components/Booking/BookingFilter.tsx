import { getAllHotel } from "@/service/api/Hotel";
import type { HotelRow } from "@/type/hotel.types";
import { useEffect, useState } from "react";
import { SelectField } from "../ui/select";
import { useTranslation } from "react-i18next";
import type { BookingStatus } from "@/type/booking.types";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { DatePickerField } from "../ui/DatePickerField";
import { Button } from "../ui/button";

const BookingFilter = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  hotelFilter,
  onHotelFilterChange,
  dateFilter,
  onDateFilterChange,
}: any) => {
  const [hotels, setHotels] = useState<HotelRow[]>([]);
  const { t } = useTranslation();
  const fetchHotels = async () => {
    try {
      const param = {
        all: true,
        filter: "status==1",
      };
      const response = await getAllHotel(param);
      setHotels(response?.data?.content || []);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchHotels();
  }, []);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <SelectField
          isRequired={false}
          items={[
            { value: "ALL", label: t("common.all") },
            { value: "1", label: t("booking.booked") },
            { value: "2", label: t("booking.checkIn") },
            { value: "3", label: t("booking.checkOut") },
            { value: "4", label: t("booking.cancelled") },
          ]}
          value={statusFilter === "ALL" ? "ALL" : String(statusFilter)}
          onChange={(v) =>
            onStatusFilterChange(
              v === "ALL" ? "ALL" : (Number(v) as BookingStatus),
            )
          }
          size="sm"
          fullWidth={false}
          getValue={(i) => i.value}
          getLabel={(i) => i.label}
        />
        <SelectField
          isRequired={false}
          items={hotels}
          value={hotelFilter}
          onChange={(v) => onHotelFilterChange(String(v))}
          size="sm"
          fullWidth={false}
          getValue={(i) => String(i.id)}
          getLabel={(i) => i.name}
        />
        <div className="w-40">
          <DatePickerField
            value={dateFilter}
            onChange={onDateFilterChange}
            placeholder={t("booking.bookingFilterDate")}
          />
        </div>
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <div className="relative w-72">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2" />
          <Input
            className="pl-9"
            value={search}
            placeholder={t("asset.searchPlaceholder")}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <Button asChild>
        <a href="/Home/booking/create">{t("booking.new")}</a>
      </Button>
    </div>
  );
};
export default BookingFilter;
