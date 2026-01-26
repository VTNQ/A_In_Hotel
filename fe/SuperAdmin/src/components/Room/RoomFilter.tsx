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
   const fetchCategories = async () => {
       try {
         const param = {
           all: true,
           filter: "type==1 and isActive==1",
         };
         const response = await getAllCategories(param);
         setCategories(response?.content || []);
       } catch (err) {
         console.error(err);
       }
     };
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
     useEffect(()=>{
       fetchCategories();
       fetchHotels();
     },[])
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-3">
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
              v === "ALL" ? "ALL" : (Number(v) as RoomStatus),
            )
          }
          size="sm"
          fullWidth={false}
          getValue={(i) => i.value}
          getLabel={(i) => i.label}
        />
          <SelectField
          isRequired={false}
          items={categories}
          value={roomTypeFilter}
          onChange={(v) => onRoomTypeFilterChange(String(v))}
          size="sm"
          fullWidth={false}
          getValue={(i) => String(i.id)}
          getLabel={(i) => i.name}
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
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <div className="relative w-72">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2" />
          <Input
            className="pl-9"
            value={search}
            placeholder={t("room.searchPlaceholder")}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
          <Button asChild>
          <a href="/Home/room/create">{t("room.new")}</a>
        </Button>
      </div>
    </div>
  );
};
export default RoomFilter;