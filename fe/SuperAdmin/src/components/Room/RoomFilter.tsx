import type { RoomFilterProps, RoomStatus } from "@/type/Room.type";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";
import { SelectField } from "../ui/select";
import type { Category } from "@/type/category.types";
import { useEffect, useState } from "react";
import { getAllCategories } from "@/service/api/Categories";
import type { HotelRow } from "@/type/hotel.types";
import { getAllHotel } from "@/service/api/Hotel";
import { Button } from "../ui/button";

const RoomFilter = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roomTypeFilter,
  onRoomTypeFilterChange,
  hotelFilter,
  onHotelFilterChange,
}: RoomFilterProps) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [hotels, setHotels] = useState<HotelRow[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchHotels();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories({
        all: true,
        filter: "type==1 and isActive==1",
      });
      setCategories(response?.content || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await getAllHotel({
        all: true,
        filter: "status==1",
      });
      setHotels(response?.data?.content || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3 lg:flex lg:items-center lg:justify-between">
        {/* LEFT FILTER GROUP */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:gap-3">
          {/* Status */}
          <div className="w-full lg:w-[180px]">
            <SelectField
              isRequired={false}
              items={[
                { value: "ALL", label: t("common.all") },
                { value: "1", label: t("room.roomStatus.vacantDirty") },
                { value: "2", label: t("room.roomStatus.occupied") },
                { value: "3", label: t("room.roomStatus.available") },
                { value: "4", label: t("room.roomStatus.maintenance") },
                { value: "5", label: t("room.roomStatus.blocked") },
                { value: "6", label: t("room.roomStatus.deactivated") },
                { value: "7", label: t("room.roomStatus.reserved") },
              ]}
              value={statusFilter === "ALL" ? "ALL" : String(statusFilter)}
              onChange={(v) =>
                onStatusFilterChange(
                  v === "ALL" ? "ALL" : (Number(v) as RoomStatus)
                )
              }
              size="sm"
              fullWidth
              getValue={(i) => i.value}
              getLabel={(i) => i.label}
            />
          </div>

          {/* Room Type */}
          <div className="w-full lg:w-[200px]">
            <SelectField
              isRequired={false}
              items={categories}
              value={roomTypeFilter}
              onChange={(v) => onRoomTypeFilterChange(String(v))}
              size="sm"
              fullWidth
              getValue={(i) => String(i.id)}
              getLabel={(i) => i.name}
            />
          </div>

          {/* Hotel */}
          <div className="w-full lg:w-[200px]">
            <SelectField
              isRequired={false}
              items={hotels}
              value={hotelFilter}
              onChange={(v) => onHotelFilterChange(String(v))}
              size="sm"
              fullWidth
              getValue={(i) => String(i.id)}
              getLabel={(i) => i.name}
            />
          </div>
        </div>

        {/* RIGHT GROUP */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center lg:gap-3">
          {/* Search */}
          <div className="relative w-full lg:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-full"
              value={search}
              placeholder={t("room.searchPlaceholder")}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Button */}
          <Button asChild className="w-full sm:w-auto whitespace-nowrap">
            <a href="/Home/room/create">{t("room.new")}</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomFilter;