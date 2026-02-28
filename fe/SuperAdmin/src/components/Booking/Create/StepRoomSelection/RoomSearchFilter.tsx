import { SelectField } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const RoomSearchFilter = ({
  filter,
  onChange,
  roomTypes = [],
  hotels = [],
  disabled,
}: any) => {
  const { t } = useTranslation();

  return (
    <div
      className="
        grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4
        rounded-2xl border p-4
        border-gray-200 bg-white
      "
    >
      {/* CHI NHÁNH */}
      <SelectField
        label={t("roomSelection.hotel")}
        items={hotels}
  value={filter.hotelId ?? ""} 
        onChange={(v) => onChange("hotelId", v)}
        placeholder={t("roomSelection.selectHotel")}
        isRequired
        getValue={(h: any) => String(h.id)}
        getLabel={(h: any) => h.name}
        size="md"
      />

      {/* SEARCH */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {t("roomSelection.searchRoom")}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            disabled={disabled}
            value={filter.search}
            onChange={(e) => onChange("search", e.target.value)}
          placeholder={t("roomSelection.searchRoom")}
            className="
              w-full h-10 pl-9 pr-3
              border border-gray-300 rounded-md
              text-sm outline-none transition
              focus:ring-2 focus:ring-indigo-400
              disabled:bg-gray-100 disabled:cursor-not-allowed
            "
          />
        </div>
      </div>

      {/* LOẠI PHÒNG */}
      <SelectField
        label={t("roomSelection.roomType")}
        items={roomTypes}
        value={filter.roomType}
        onChange={(v) => onChange("roomType", v)}
        placeholder={t("roomSelection.allRoomTypes")}
        disabled={disabled}
        isRequired={false}
        getValue={(rt: any) => String(rt.id)}
        getLabel={(rt: any) => rt.name}
        size="md"
      />
    </div>
  );
};

export default RoomSearchFilter;
